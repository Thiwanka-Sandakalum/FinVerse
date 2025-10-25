"""
LightFM implementation of the recommendation model interface.
"""
import logging
import os
import pickle
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

import numpy as np
import scipy.sparse as sp
from lightfm import LightFM
from lightfm.data import Dataset

from ...domain.entities.recommendation_entities import (
    ProductRecommendation,
    RecommendationModelInterface,
    UserInteraction,
)
from ...domain.services.recommendation_domain_service import (
    RecommendationDomainService
)
from ...shared.constants.model_constants import (
    FEATURE_MAPPING_FILENAME,
    ITEM_FEATURES_FILENAME,
    ITEM_MAPPING_FILENAME,
    MODEL_FILENAME,
    USER_FEATURES_FILENAME,
    USER_MAPPING_FILENAME,
)
from ...shared.exceptions.exceptions import (
    FileOperationError,
    ModelNotReadyError,
    ModelTrainingError,
    ProductNotFoundError,
    UserNotFoundError,
)

logger = logging.getLogger(__name__)


class LightFMRecommendationModel(RecommendationModelInterface):
    """LightFM implementation of the recommendation model."""
    
    def __init__(
        self, 
        data_dir: Path, 
        model_config: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Initialize the LightFM model.
        
        Args:
            data_dir: Directory to store model files
            model_config: Model configuration parameters
        """
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        
        # Model configuration
        self.model_config = model_config or {}
        
        # Model components
        self.model: Optional[LightFM] = None
        self.dataset: Optional[Dataset] = None
        self.user_features: Optional[sp.csr_matrix] = None
        self.item_features: Optional[sp.csr_matrix] = None
        
        # Mappings
        self.user_mapping: Dict[str, int] = {}
        self.item_mapping: Dict[str, int] = {}
        self.reverse_user_mapping: Dict[int, str] = {}
        self.reverse_item_mapping: Dict[int, str] = {}
        self.feature_mapping: Dict[str, int] = {}
        
        logger.info(f"Initialized LightFM model with data_dir: {self.data_dir}")
    
    async def train(self, interactions: List[UserInteraction]) -> None:
        """
        Train the model with user interactions.
        
        Args:
            interactions: List of user interactions
            
        Raises:
            ModelTrainingError: If training fails
        """
        try:
            logger.info(f"Starting model training with {len(interactions)} interactions")
            
            # Prepare data
            interaction_matrix, user_features, item_features = self._prepare_training_data(
                interactions
            )
            
            # Extract training parameters from config
            fit_params = {}
            lightfm_params = {}
            
            for key, value in self.model_config.items():
                if key in ['epochs', 'num_threads', 'verbose']:
                    fit_params[key] = value
                else:
                    lightfm_params[key] = value
            
            # Initialize model
            self.model = LightFM(**lightfm_params)
            
            # Train model
            self.model.fit(
                interactions=interaction_matrix,
                user_features=user_features,
                item_features=item_features,
                verbose=fit_params.get('verbose', True),
                epochs=fit_params.get('epochs', 20),
                num_threads=fit_params.get('num_threads', 1)
            )
            
            # Store feature matrices
            self.user_features = user_features
            self.item_features = item_features
            
            # Save model and mappings
            await self.save()
            
            logger.info("Model training completed successfully")
            
        except Exception as e:
            logger.error(f"Model training failed: {str(e)}")
            raise ModelTrainingError(f"Failed to train model: {str(e)}")
    
    async def predict_for_user(
        self, 
        user_id: str, 
        count: int
    ) -> List[ProductRecommendation]:
        """
        Get recommendations for a specific user.
        
        Args:
            user_id: User ID to get recommendations for
            count: Number of recommendations to return
            
        Returns:
            List of product recommendations
            
        Raises:
            ModelNotReadyError: If model is not ready
            UserNotFoundError: If user is not found in model
        """
        if not self.is_ready():
            raise ModelNotReadyError("Model is not ready for predictions")
        
        if user_id not in self.user_mapping:
            raise UserNotFoundError(f"User {user_id} not found in model")
        
        try:
            user_idx = self.user_mapping[user_id]
            
            # Get all item indices
            all_items = list(range(len(self.item_mapping)))
            user_ids = np.repeat(user_idx, len(all_items))
            
            # Predict scores
            scores = self.model.predict(
                user_ids=user_ids,
                item_ids=all_items,
                user_features=self.user_features,
                item_features=self.item_features
            )
            
            # Get top N recommendations
            top_item_indices = np.argsort(-scores)[:count]
            
            recommendations = []
            for rank, item_idx in enumerate(top_item_indices, 1):
                product_id = self.reverse_item_mapping[item_idx]
                recommendation = ProductRecommendation(
                    id=product_id,
                    relevance_score=float(scores[item_idx]),
                    rank=rank
                )
                recommendations.append(recommendation)
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error predicting for user {user_id}: {str(e)}")
            raise ModelTrainingError(f"Prediction failed: {str(e)}")
    
    async def predict_similar_products(
        self, 
        product_id: str, 
        count: int
    ) -> List[ProductRecommendation]:
        """
        Get similar products for a given product.
        
        Args:
            product_id: Product ID to find similar products for
            count: Number of similar products to return
            
        Returns:
            List of similar product recommendations
            
        Raises:
            ModelNotReadyError: If model is not ready
            ProductNotFoundError: If product is not found in model
        """
        if not self.is_ready():
            raise ModelNotReadyError("Model is not ready for predictions")
        
        if product_id not in self.item_mapping:
            raise ProductNotFoundError(f"Product {product_id} not found in model")
        
        try:
            item_idx = self.item_mapping[product_id]
            
            # Get item representations
            _, item_embeddings = self.model.get_item_representations(
                features=self.item_features
            )
            
            # Calculate similarities
            target_embedding = item_embeddings[item_idx]
            similarities = item_embeddings.dot(target_embedding) / (
                np.linalg.norm(item_embeddings, axis=1) * np.linalg.norm(target_embedding)
            )
            
            # Get top similar products (excluding the product itself)
            all_indices = list(range(len(similarities)))
            all_indices.remove(item_idx)  # Remove self
            
            similarities_filtered = similarities[all_indices]
            top_indices = np.argsort(-similarities_filtered)[:count]
            
            recommendations = []
            for rank, idx in enumerate(top_indices, 1):
                actual_item_idx = all_indices[idx]
                product_id_similar = self.reverse_item_mapping[actual_item_idx]
                similarity_score = float(similarities_filtered[idx])
                
                recommendation = ProductRecommendation(
                    id=product_id_similar,
                    relevance_score=similarity_score,
                    rank=rank
                )
                recommendations.append(recommendation)
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error finding similar products for {product_id}: {str(e)}")
            raise ModelTrainingError(f"Similar products prediction failed: {str(e)}")
    
    def is_ready(self) -> bool:
        """Check if the model is ready for predictions."""
        return (
            self.model is not None and 
            self.user_features is not None and 
            self.item_features is not None and 
            len(self.user_mapping) > 0 and 
            len(self.item_mapping) > 0
        )
    
    async def save(self) -> None:
        """
        Save the model to files.
        
        Raises:
            FileOperationError: If saving fails
        """
        try:
            # Save model
            if self.model is not None:
                model_path = self.data_dir / MODEL_FILENAME
                with open(model_path, 'wb') as f:
                    pickle.dump(self.model, f)
            
            # Save feature matrices
            if self.user_features is not None:
                user_features_path = self.data_dir / USER_FEATURES_FILENAME
                sp.save_npz(user_features_path, self.user_features)
            
            if self.item_features is not None:
                item_features_path = self.data_dir / ITEM_FEATURES_FILENAME
                sp.save_npz(item_features_path, self.item_features)
            
            # Save mappings
            mappings = [
                (USER_MAPPING_FILENAME, self.user_mapping),
                (ITEM_MAPPING_FILENAME, self.item_mapping),
                (FEATURE_MAPPING_FILENAME, self.feature_mapping),
            ]
            
            for filename, mapping in mappings:
                if mapping:
                    mapping_path = self.data_dir / filename
                    with open(mapping_path, 'wb') as f:
                        pickle.dump(mapping, f)
            
            logger.info("Model saved successfully")
            
        except Exception as e:
            logger.error(f"Error saving model: {str(e)}")
            raise FileOperationError(f"Failed to save model: {str(e)}")
    
    async def load(self) -> None:
        """
        Load the model from files.
        
        Raises:
            FileOperationError: If loading fails
        """
        try:
            # Load model
            model_path = self.data_dir / MODEL_FILENAME
            if model_path.exists():
                with open(model_path, 'rb') as f:
                    self.model = pickle.load(f)
            
            # Load feature matrices
            user_features_path = self.data_dir / USER_FEATURES_FILENAME
            if user_features_path.exists():
                self.user_features = sp.load_npz(user_features_path)
            
            item_features_path = self.data_dir / ITEM_FEATURES_FILENAME
            if item_features_path.exists():
                self.item_features = sp.load_npz(item_features_path)
            
            # Load mappings
            mappings = [
                (USER_MAPPING_FILENAME, 'user_mapping'),
                (ITEM_MAPPING_FILENAME, 'item_mapping'),
                (FEATURE_MAPPING_FILENAME, 'feature_mapping'),
            ]
            
            for filename, attr_name in mappings:
                mapping_path = self.data_dir / filename
                if mapping_path.exists():
                    with open(mapping_path, 'rb') as f:
                        setattr(self, attr_name, pickle.load(f))
            
            # Rebuild reverse mappings
            self.reverse_user_mapping = {v: k for k, v in self.user_mapping.items()}
            self.reverse_item_mapping = {v: k for k, v in self.item_mapping.items()}
            
            if self.is_ready():
                logger.info("Model loaded successfully")
            else:
                logger.warning("Model loaded but not ready for predictions")
            
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise FileOperationError(f"Failed to load model: {str(e)}")
    
    async def load_if_exists(self) -> bool:
        """
        Load model if files exist.
        
        Returns:
            True if model was loaded, False if files don't exist
        """
        model_path = self.data_dir / MODEL_FILENAME
        if model_path.exists():
            await self.load()
            return True
        return False
    
    def _prepare_training_data(
        self, 
        interactions: List[UserInteraction]
    ) -> Tuple[sp.coo_matrix, sp.csr_matrix, sp.csr_matrix]:
        """
        Prepare training data from interactions.
        
        Args:
            interactions: List of user interactions
            
        Returns:
            Tuple of (interaction_matrix, user_features, item_features)
        """
        # Extract unique entities and build features
        users: Set[str] = set()
        items: Set[str] = set()
        user_features_dict: Dict[str, Set[str]] = {}
        item_features_dict: Dict[str, Set[str]] = {}
        interaction_weights: Dict[Tuple[str, str], float] = {}
        
        for interaction in interactions:
            user_id = interaction.user_id
            if not user_id:
                continue
            
            users.add(user_id)
            
            # Initialize user features
            if user_id not in user_features_dict:
                user_features_dict[user_id] = set()
            
            # Add interaction type as user feature
            user_features_dict[user_id].add(f"action:{interaction.interaction_type}")
            
            # Add user demographics features
            if interaction.user_demographics:
                demographics = interaction.user_demographics
                for key, value in demographics.items():
                    if value is not None:
                        user_features_dict[user_id].add(f"{key}:{value}")
            
            # Process product interactions
            for product_id in interaction.product_ids:
                if not product_id:
                    continue
                
                items.add(product_id)
                
                # Initialize item features
                if product_id not in item_features_dict:
                    item_features_dict[product_id] = set()
                
                # Add product features
                if interaction.category:
                    item_features_dict[product_id].add(f"category:{interaction.category}")
                
                if interaction.institution:
                    item_features_dict[product_id].add(f"institution:{interaction.institution}")
                
                # Calculate interaction weight
                weight = RecommendationDomainService.calculate_interaction_weight(interaction)
                key = (user_id, product_id)
                interaction_weights[key] = max(weight, interaction_weights.get(key, 0.0))
        
        # Create dataset
        self.dataset = Dataset()
        
        # Fit dataset
        all_user_features = set().union(*user_features_dict.values()) if user_features_dict else set()
        all_item_features = set().union(*item_features_dict.values()) if item_features_dict else set()
        
        self.dataset.fit(
            users=list(users),
            items=list(items),
            user_features=all_user_features,
            item_features=all_item_features
        )
        
        # Get mappings
        mappings = self.dataset.mapping()
        self.user_mapping = mappings[0]
        self.feature_mapping = mappings[1]
        self.item_mapping = mappings[2]
        
        self.reverse_user_mapping = {v: k for k, v in self.user_mapping.items()}
        self.reverse_item_mapping = {v: k for k, v in self.item_mapping.items()}
        
        # Build interaction matrix
        data = []
        rows = []
        cols = []
        
        for (user_id, product_id), weight in interaction_weights.items():
            if user_id in self.user_mapping and product_id in self.item_mapping:
                data.append(weight)
                rows.append(self.user_mapping[user_id])
                cols.append(self.item_mapping[product_id])
        
        interaction_matrix = sp.coo_matrix(
            (data, (rows, cols)),
            shape=(len(self.user_mapping), len(self.item_mapping))
        )
        
        # Build feature matrices
        user_features = self.dataset.build_user_features(
            ((uid, list(features)) for uid, features in user_features_dict.items() 
             if uid in self.user_mapping),
            normalize=True
        )
        
        item_features = self.dataset.build_item_features(
            ((pid, list(features)) for pid, features in item_features_dict.items() 
             if pid in self.item_mapping),
            normalize=True
        )
        
        logger.info(
            f"Training data prepared: {len(users)} users, {len(items)} items, "
            f"{len(interaction_weights)} interactions"
        )
        
        return interaction_matrix, user_features, item_features