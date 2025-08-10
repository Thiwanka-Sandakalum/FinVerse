"""
Recommendation service implementation using LightFM.

This module handles building and using a hybrid recommendation model
based on collaborative filtering and content-based filtering.
"""
import logging
import numpy as np
import scipy.sparse as sp
from typing import List, Dict, Any, TypedDict, Tuple
import asyncio
from datetime import datetime, timedelta
from fastapi import Request
import pickle
import os
from lightfm.data import Dataset
from lightfm import LightFM

class ModelRefreshResult(TypedDict, total=False):
    """Type definition for model refresh result"""
    success: bool
    duration_seconds: float
    timestamp: str
    num_users: int
    num_products: int
    error: str

from services.db_service import DBService, get_db_service
from services.banking_service import BankingServiceClient
from models.hybrid_model import HybridRecommendationModel
from models.data_pipeline import DataPipeline
from config import settings

# Configure logging
logger = logging.getLogger("recommendation-service")

# Constants
MODEL_PATH = "../data/recommendation_model.pkl"
USER_FEATURES_PATH = "../data/user_features.npz"
ITEM_FEATURES_PATH = "../data/item_features.npz"
USER_MAPPING_PATH = "../data/user_mapping.pkl"
ITEM_MAPPING_PATH = "../data/item_mapping.pkl"
FEATURE_MAPPING_PATH = "../data/feature_mapping.pkl"

# Model hyperparameters
NUM_COMPONENTS = 30
LEARNING_RATE = 0.05
LOSS = 'warp'  # Weighted Approximate-Rank Pairwise
EPOCHS = 20
USER_ALPHA = 1e-6
ITEM_ALPHA = 1e-6

class RecommendationService:
    """Service for generating product recommendations"""
    
    def __init__(self, db_service: DBService):
        """
        Initialize the recommendation service.
        
        Args:
            db_service: Database service for retrieving interaction data
        """
        self.db_service = db_service
        self.model = None
        self.dataset = None
        self.user_features = None
        self.item_features = None
        self.user_mapping = {}  # Maps user IDs to internal indices
        self.item_mapping = {}  # Maps product IDs to internal indices
        self.reverse_user_mapping = {}  # Maps internal indices to user IDs
        self.reverse_item_mapping = {}  # Maps internal indices to product IDs
        self.feature_mapping = {}  # Maps feature names to internal indices
        self.last_refresh = None
        
        # Create data directory if it doesn't exist
        os.makedirs("../data", exist_ok=True)
        
        # Try to load existing model and mappings
        self._load_model_and_mappings()
    
    def _load_model_and_mappings(self):
        """Load existing model and mappings from files if they exist"""
        try:
            if os.path.exists(MODEL_PATH):
                with open(MODEL_PATH, 'rb') as f:
                    self.model = pickle.load(f)
                logger.info("Loaded recommendation model from file")
            
            if os.path.exists(USER_FEATURES_PATH):
                self.user_features = sp.load_npz(USER_FEATURES_PATH)
                logger.info("Loaded user features from file")
            
            if os.path.exists(ITEM_FEATURES_PATH):
                self.item_features = sp.load_npz(ITEM_FEATURES_PATH)
                logger.info("Loaded item features from file")
            
            if os.path.exists(USER_MAPPING_PATH):
                with open(USER_MAPPING_PATH, 'rb') as f:
                    self.user_mapping = pickle.load(f)
                self.reverse_user_mapping = {v: k for k, v in self.user_mapping.items()}
                logger.info(f"Loaded user mapping from file ({len(self.user_mapping)} users)")
            
            if os.path.exists(ITEM_MAPPING_PATH):
                with open(ITEM_MAPPING_PATH, 'rb') as f:
                    self.item_mapping = pickle.load(f)
                self.reverse_item_mapping = {v: k for k, v in self.item_mapping.items()}
                logger.info(f"Loaded item mapping from file ({len(self.item_mapping)} products)")
            
            if os.path.exists(FEATURE_MAPPING_PATH):
                with open(FEATURE_MAPPING_PATH, 'rb') as f:
                    self.feature_mapping = pickle.load(f)
                logger.info(f"Loaded feature mapping from file ({len(self.feature_mapping)} features)")
                
        except Exception as e:
            logger.error(f"Error loading model or mappings: {str(e)}")
    
    async def _save_model_and_mappings(self):
        """Save current model and mappings to files"""
        try:
            if self.model is not None:
                with open(MODEL_PATH, 'wb') as f:
                    pickle.dump(self.model, f)
            
            if self.user_features is not None:
                sp.save_npz(USER_FEATURES_PATH, self.user_features)
            
            if self.item_features is not None:
                sp.save_npz(ITEM_FEATURES_PATH, self.item_features)
            
            if self.user_mapping:
                with open(USER_MAPPING_PATH, 'wb') as f:
                    pickle.dump(self.user_mapping, f)
            
            if self.item_mapping:
                with open(ITEM_MAPPING_PATH, 'wb') as f:
                    pickle.dump(self.item_mapping, f)
            
            if self.feature_mapping:
                with open(FEATURE_MAPPING_PATH, 'wb') as f:
                    pickle.dump(self.feature_mapping, f)
            
            logger.info("Saved model and mappings to files")
        except Exception as e:
            logger.error(f"Error saving model or mappings: {str(e)}")
    
    async def _prepare_data(self):
        """
        Prepare training data for the recommendation model.
        
        Returns:
            Tuple of (interactions, user_features, item_features)
        """
        # Retrieve data
        logger.info("Retrieving interaction data from database")
        user_product_interactions = await self.db_service.get_user_product_interactions(limit=50000)
        
        # Create dataset
        self.dataset = Dataset()
        
                # Extract unique user IDs and product IDs
        users = set()
        products = set()  # Changed from items to products to match the variable name used later
        user_features_dict = {}
        product_features_dict = {}
        interaction_weights = {}  # To store weights for user-item interactions
        
        for interaction in user_product_interactions:
            user_id = interaction.get("user_id")
            if not user_id:
                continue
                
            # Extract product ID(s)
            product_id = None
            if "data" in interaction:
                if "productId" in interaction["data"]:
                    product_id = interaction["data"]["productId"]
                elif "productIDs" in interaction["data"] and interaction["data"]["productIDs"]:
                    # For comparison events, we'll use each product in the comparison
                    for pid in interaction["data"]["productIDs"]:
                        products.add(pid)
                        
                        # Build features for this product
                        if pid not in product_features_dict:
                            product_features_dict[pid] = set()
            
            if product_id:
                products.add(product_id)
                
                # Build features for this product
                if product_id not in product_features_dict:
                    product_features_dict[product_id] = set()
                    
                # Add product features
                if "data" in interaction:
                    # Add category as feature
                    if "category" in interaction["data"]:
                        product_features_dict[product_id].add(f"category:{interaction['data']['category']}")
                    
                    # Add institution as feature
                    if "institution" in interaction["data"]:
                        product_features_dict[product_id].add(f"institution:{interaction['data']['institution']}")
            
            # Extract user features
            if user_id not in user_features_dict:
                user_features_dict[user_id] = set()
            
            # Add interaction features with weights
            interaction_type = interaction.get("type")
            if interaction_type:
                user_features_dict[user_id].add(f"action:{interaction_type}")
                
                # Set interaction weight based on type
                weight = 1.0
                if interaction_type == "product_view":
                    weight = 1.0
                    if "data" in interaction and "viewDuration" in interaction["data"]:
                        view_duration = interaction["data"]["viewDuration"]
                        if view_duration > 120:  # More than 2 minutes
                            weight = 2.0
                        elif view_duration > 60:  # More than 1 minute
                            weight = 1.5
                elif interaction_type == "product_application":
                    weight = 3.0  # Highest weight for applications
                elif interaction_type == "product_inquiry":
                    weight = 1.5
                elif interaction_type == "product_bookmark":
                    weight = 2.0
                
                if product_id:
                    key = (user_id, product_id)
                    interaction_weights[key] = max(weight, interaction_weights.get(key, 0))
            
            # Add user demographic features
            if "data" in interaction and "userDemographics" in interaction["data"]:
                demographics = interaction["data"]["userDemographics"]
                
                if "age_group" in demographics:
                    user_features_dict[user_id].add(f"age_group:{demographics['age_group']}")
                
                if "income_range" in demographics:
                    user_features_dict[user_id].add(f"income_range:{demographics['income_range']}")
                    
                if "occupation" in demographics:
                    user_features_dict[user_id].add(f"occupation:{demographics['occupation']}")
                    
                if "location" in demographics:
                    user_features_dict[user_id].add(f"location:{demographics['location']}")
            
            users.add(user_id)
        
        # Fit dataset with users and products
        self.dataset.fit(
            users=list(users),
            items=list(products),
            user_features=set().union(*user_features_dict.values()) if user_features_dict else set(),
            item_features=set().union(*product_features_dict.values()) if product_features_dict else set()
        )
        
        # Get mappings
        self.user_mapping = self.dataset.mapping()[0]
        self.item_mapping = self.dataset.mapping()[2]
        self.feature_mapping = self.dataset.mapping()[1]
        
        self.reverse_user_mapping = {v: k for k, v in self.user_mapping.items()}
        self.reverse_item_mapping = {v: k for k, v in self.item_mapping.items()}
        
        # Build interaction matrix
        logger.info(f"Building interaction matrix with {len(users)} users and {len(products)} products")
        interactions = []
        
        for interaction in user_product_interactions:
            user_id = interaction.get("user_id")
            if not user_id or user_id not in self.user_mapping:
                continue
                
            # Get interaction weight based on type
            weight = 1.0
            if interaction["type"] == "product_view":
                weight = 1.0
            elif interaction["type"] == "comparison":
                weight = 0.8
            elif interaction["type"] == "interaction":
                # For generic interactions, check the action
                if "data" in interaction and "action" in interaction["data"]:
                    action = interaction["data"]["action"]
                    if action == "click":
                        weight = 0.5
                    elif action == "favorite" or action == "save":
                        weight = 1.5
                    elif action == "apply" or action == "purchase":
                        weight = 2.0
                    else:
                        weight = 0.3
            
            # Extract product ID(s)
            if "data" in interaction:
                if "productId" in interaction["data"]:
                    product_id = interaction["data"]["productId"]
                    if product_id in self.item_mapping:
                        interactions.append((
                            self.user_mapping[user_id],
                            self.item_mapping[product_id],
                            weight
                        ))
                elif "productIDs" in interaction["data"] and interaction["data"]["productIDs"]:
                    for pid in interaction["data"]["productIDs"]:
                        if pid in self.item_mapping:
                            interactions.append((
                                self.user_mapping[user_id],
                                self.item_mapping[pid],
                                weight
                            ))
        
        # Create sparse interaction matrix with weighted interactions
        data = []
        rows = []
        cols = []
        
        # Process interactions with weights from interaction_weights
        for user_id, product_id in interaction_weights:
            if user_id in self.user_mapping and product_id in self.item_mapping:
                data.append(interaction_weights[(user_id, product_id)])
                rows.append(self.user_mapping[user_id])
                cols.append(self.item_mapping[product_id])
        
        interaction_matrix = sp.coo_matrix(
            (data, (rows, cols)),
            shape=(len(self.user_mapping), len(self.item_mapping))
        )
        
        # Build user and item feature matrices
        user_features = self.dataset.build_user_features(
            ((uid, list(features)) for uid, features in user_features_dict.items() if uid in self.user_mapping),
            normalize=True
        )
        
        item_features = self.dataset.build_item_features(
            ((pid, list(features)) for pid, features in product_features_dict.items() if pid in self.item_mapping),
            normalize=True
        )
        
        self.user_features = user_features
        self.item_features = item_features
        
        logger.info("Data preparation complete")
        return interaction_matrix, user_features, item_features
    
    async def _train_model(self):
        """Train the recommendation model"""
        logger.info("Training recommendation model")
        
        # Prepare data
        interactions, user_features, item_features = await self._prepare_data()
        
        # Initialize model with optimized hyperparameters
        model = LightFM(
            no_components=50,  # Increased from 30 for better representation
            learning_rate=0.05,
            loss='warp',  # Better for ranking tasks
            user_alpha=1e-5,  # L2 penalty for user features
            item_alpha=1e-5,  # L2 penalty for item features
            max_sampled=30  # Increased negative sampling for better discrimination
        )
        
        # Train model
        model.fit(
            interactions=interactions,
            user_features=user_features,
            item_features=item_features,
            epochs=EPOCHS,
            verbose=True
        )
        
        self.model = model
        self.last_refresh = datetime.now()
        
        # Save model and mappings
        await self._save_model_and_mappings()
        
        logger.info("Model training complete")
        return model
    
    async def refresh_model(self) -> ModelRefreshResult:
        """
        Refresh the recommendation model with the latest data.
        
        Returns:
            Dict with status information
        """
        start_time = datetime.now()
        
        try:
            await self._train_model()
            
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            return ModelRefreshResult(
                success=True,
                duration_seconds=duration,
                timestamp=datetime.now().isoformat(),
                num_users=len(self.user_mapping),
                num_products=len(self.item_mapping)
            )
        except Exception as e:
            logger.error(f"Error refreshing model: {str(e)}")
            return ModelRefreshResult(
                success=False,
                error=str(e),
                timestamp=datetime.now().isoformat()
            )
    
    async def _get_product_details(self, product_ids: List[str]) -> Dict[str, Dict[str, Any]]:
        """
        Get product details for the given product IDs.
        
        In a real implementation, this would retrieve product details from a product service.
        For now, we'll just return the product IDs with dummy data.
        
        Args:
            product_ids: List of product IDs
            
        Returns:
            Dict mapping product IDs to product details
        """
        # TODO: Implement actual product details retrieval from product service
        product_details = {}
        for pid in product_ids:
            product_details[pid] = {
                "id": pid,
                "name": f"Product {pid}",
                "category": "Unknown",
                "description": "Product description would be retrieved from product service"
            }
        return product_details
    
    async def get_recommendations_for_user(self, user_id: str, count: int = 5) -> List[Dict[str, Any]]:
        """
        Get personalized product recommendations for a specific user.
        
        Args:
            user_id: User ID
            count: Number of recommendations to return
            
        Returns:
            List of recommended products with relevance scores
        """
        # Check if model is ready
        if self.model is None or self.user_mapping is None or self.item_mapping is None:
            logger.warning("Model not ready, refreshing...")
            await self.refresh_model()
        
        # Handle cold start problem for new users
        if user_id not in self.user_mapping:
            logger.info(f"User {user_id} not in model, using most popular products")
            return await self._get_most_popular_products(count)
        
        try:
            # Get user index
            user_idx = self.user_mapping[user_id]
            
            # Create repeated user IDs for each item
            all_items = list(range(len(self.item_mapping)))
            user_ids = np.repeat(user_idx, len(all_items))
            
            # Predict scores for all items
            scores = self.model.predict(
                user_ids=user_ids,
                item_ids=all_items,
                user_features=self.user_features,
                item_features=self.item_features
            )
            
            # Get top N recommendations
            top_items = np.argsort(-scores)[:count]
            
            # Convert to product IDs and scores
            recommendations = []
            product_ids = [self.reverse_item_mapping[idx] for idx in top_items]
            
            # Get product details
            product_details = await self._get_product_details(product_ids)
            
            for idx, product_idx in enumerate(top_items):
                product_id = self.reverse_item_mapping[product_idx]
                recommendations.append({
                    **product_details.get(product_id, {"id": product_id}),
                    "relevanceScore": float(scores[product_idx]),
                    "rank": idx + 1
                })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating recommendations for user {user_id}: {str(e)}")
            return await self._get_most_popular_products(count)
    
    async def get_recommendations_for_session(self, session_id: str, count: int = 5) -> List[Dict[str, Any]]:
        """
        Get recommendations based on the current session for anonymous users.
        
        Args:
            session_id: Session ID
            count: Number of recommendations to return
            
        Returns:
            List of recommended products with relevance scores
        """
        # Get session interactions
        session_interactions = await self.db_service.get_session_interactions(session_id)
        
        if not session_interactions:
            logger.info(f"No interactions found for session {session_id}, using most popular products")
            return await self._get_most_popular_products(count)
        
        # Extract viewed products
        viewed_products = []
        for interaction in session_interactions:
            if "data" in interaction:
                if "productId" in interaction["data"]:
                    viewed_products.append(interaction["data"]["productId"])
                elif "productIDs" in interaction["data"] and interaction["data"]["productIDs"]:
                    viewed_products.extend(interaction["data"]["productIDs"])
        
        # If no viewed products, return most popular
        if not viewed_products:
            return await self._get_most_popular_products(count)
        
        # Get similar products to the viewed products
        all_similar_products = []
        for product_id in viewed_products[:3]:  # Use at most 3 products for recommendations
            similar = await self.get_similar_products(product_id, count=3)
            all_similar_products.extend(similar)
        
        # Deduplicate and sort by relevance score
        seen = set()
        unique_recommendations = []
        for rec in all_similar_products:
            if rec["id"] not in seen and rec["id"] not in viewed_products:
                seen.add(rec["id"])
                unique_recommendations.append(rec)
        
        # Sort by relevance score
        sorted_recommendations = sorted(unique_recommendations, key=lambda x: x.get("relevanceScore", 0), reverse=True)
        
        # Return top N
        return sorted_recommendations[:count]
    
    async def get_similar_products(self, product_id: str, count: int = 5) -> List[Dict[str, Any]]:
        """
        Get similar products to a given product.
        
        Args:
            product_id: Product ID
            count: Number of similar products to return
            
        Returns:
            List of similar products with similarity scores
        """
        # Check if model is ready
        if self.model is None or self.item_mapping is None:
            logger.warning("Model not ready, refreshing...")
            await self.refresh_model()
        
        # Handle cold start problem for new products
        if product_id not in self.item_mapping:
            logger.info(f"Product {product_id} not in model, using most popular products")
            return await self._get_most_popular_products(count)
        
        try:
            # Get item representations
            item_biases, item_embeddings = self.model.get_item_representations(features=self.item_features)
            
            # Get embedding for the target product
            item_idx = self.item_mapping[product_id]
            target_embedding = item_embeddings[item_idx]
            
            # Calculate cosine similarity with all other products
            similarities = item_embeddings.dot(target_embedding) / (
                np.linalg.norm(item_embeddings, axis=1) * np.linalg.norm(target_embedding)
            )
            
            # Get top N similar products (excluding the product itself)
            similar_indices = []
            scores = []
            for idx, score in enumerate(similarities):
                if idx != item_idx:
                    similar_indices.append(idx)
                    scores.append(score)
            
            # Sort by similarity
            sorted_indices = np.argsort(-np.array(scores))[:count]
            top_similar = [similar_indices[idx] for idx in sorted_indices]
            top_scores = [scores[idx] for idx in sorted_indices]
            
            # Convert to product IDs and scores
            similar_products = []
            product_ids = [self.reverse_item_mapping[idx] for idx in top_similar]
            
            # Get product details
            product_details = await self._get_product_details(product_ids)
            
            for idx, (product_idx, score) in enumerate(zip(top_similar, top_scores)):
                product_id = self.reverse_item_mapping[product_idx]
                similar_products.append({
                    **product_details.get(product_id, {"id": product_id}),
                    "similarityScore": float(score),
                    "relevanceScore": float(score),  # For consistent interface
                    "rank": idx + 1
                })
            
            return similar_products
            
        except Exception as e:
            logger.error(f"Error finding similar products for {product_id}: {str(e)}")
            return await self._get_most_popular_products(count)
    
    async def _get_most_popular_products(self, count: int = 5) -> List[Dict[str, Any]]:
        """
        Get the most popular products based on view counts.
        
        Used as a fallback for new users or products.
        
        Args:
            count: Number of products to return
            
        Returns:
            List of popular products
        """
        try:
            # Get most viewed products from DB
            most_viewed = await self.db_service.get_most_viewed_products(count)
            
            # Format response
            popular_products = []
            product_ids = [product["productId"] for product in most_viewed]
            
            # Get product details
            product_details = await self._get_product_details(product_ids)
            
            for idx, product in enumerate(most_viewed):
                product_id = product["productId"]
                popular_products.append({
                    **product_details.get(product_id, {"id": product_id}),
                    "viewCount": product.get("count", 0),
                    "relevanceScore": 0.5,  # Default relevance score
                    "rank": idx + 1
                })
            
            return popular_products
            
        except Exception as e:
            logger.error(f"Error getting popular products: {str(e)}")
            
            # Return dummy data as last resort
            dummy_products = []
            for i in range(count):
                dummy_products.append({
                    "id": f"product-{i+1}",
                    "name": f"Popular Product {i+1}",
                    "relevanceScore": 0.5,
                    "rank": i + 1
                })
            
            return dummy_products

from fastapi import Request

# Dependency injection function for FastAPI
async def get_recommendation_service(request: Request) -> RecommendationService:
    """
    Dependency injection for RecommendationService.
    Uses FastAPI Request to access app state.
    """
    app = request.app
    db_service = getattr(app.state, 'db_service', None)
    if db_service is None:
        from services.db_service import get_db_service
        db_service = get_db_service(app)
        app.state.db_service = db_service

    recommendation_service = getattr(app.state, 'recommendation_service', None)
    if recommendation_service is None:
        recommendation_service = RecommendationService(db_service)
        app.state.recommendation_service = recommendation_service
        asyncio.create_task(recommendation_service.refresh_model())

    return recommendation_service
