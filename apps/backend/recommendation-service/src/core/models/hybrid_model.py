"""
Hybrid recommendation model implementation using LightFM.

This module contains the implementation of the hybrid recommendation model
that combines collaborative filtering with content-based filtering using LightFM.
"""
import numpy as np
import scipy.sparse as sp
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import pickle
import os
from lightfm import LightFM

from src.core.config import settings
from src.core.logging import get_logger

logger = get_logger(__name__)

class HybridRecommendationModel:
    """Hybrid recommendation model using LightFM"""
    
    def __init__(self):
        """Initialize the hybrid recommendation model"""
        self.model = None
        self.user_features = None
        self.item_features = None
        self.user_mapping = {}
        self.item_mapping = {}
        self.reverse_user_mapping = {}
        self.reverse_item_mapping = {}
        self.feature_mapping = {}
        self.last_trained = None
        
        # Try to load existing model
        self._load_model()
    
    def _load_model(self) -> bool:
        """
        Load the model from disk if it exists.
        
        Returns:
            True if model was loaded successfully, False otherwise
        """
        try:
            model_path = os.path.join(settings.DATA_DIR, "recommendation_model.pkl")
            user_features_path = os.path.join(settings.DATA_DIR, "user_features.npz")
            item_features_path = os.path.join(settings.DATA_DIR, "item_features.npz")
            user_mapping_path = os.path.join(settings.DATA_DIR, "user_mapping.pkl")
            item_mapping_path = os.path.join(settings.DATA_DIR, "item_mapping.pkl")
            feature_mapping_path = os.path.join(settings.DATA_DIR, "feature_mapping.pkl")

            if not os.path.exists(model_path):
                logger.warning("No existing model found")
                return False
            
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            
            if os.path.exists(user_features_path):
                self.user_features = sp.load_npz(user_features_path)
            
            if os.path.exists(item_features_path):
                self.item_features = sp.load_npz(item_features_path)
            
            if os.path.exists(user_mapping_path):
                with open(user_mapping_path, 'rb') as f:
                    self.user_mapping = pickle.load(f)
                self.reverse_user_mapping = {v: k for k, v in self.user_mapping.items()}
            
            if os.path.exists(item_mapping_path):
                with open(item_mapping_path, 'rb') as f:
                    self.item_mapping = pickle.load(f)
                self.reverse_item_mapping = {v: k for k, v in self.item_mapping.items()}
            
            if os.path.exists(feature_mapping_path):
                with open(feature_mapping_path, 'rb') as f:
                    self.feature_mapping = pickle.load(f)
            
            logger.info(f"Loaded model with {len(self.user_mapping)} users and {len(self.item_mapping)} items")
            return True
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            return False
    
    def save_model(self) -> bool:
        """
        Save the model to disk.
        
        Returns:
            True if model was saved successfully, False otherwise
        """
        try:
            model_path = os.path.join(settings.DATA_DIR, "recommendation_model.pkl")
            user_features_path = os.path.join(settings.DATA_DIR, "user_features.npz")
            item_features_path = os.path.join(settings.DATA_DIR, "item_features.npz")
            user_mapping_path = os.path.join(settings.DATA_DIR, "user_mapping.pkl")
            item_mapping_path = os.path.join(settings.DATA_DIR, "item_mapping.pkl")
            feature_mapping_path = os.path.join(settings.DATA_DIR, "feature_mapping.pkl")

            os.makedirs(os.path.dirname(model_path), exist_ok=True)
            
            with open(model_path, 'wb') as f:
                pickle.dump(self.model, f)
            
            if self.user_features is not None:
                sp.save_npz(user_features_path, self.user_features)
            
            if self.item_features is not None:
                sp.save_npz(item_features_path, self.item_features)
            
            if self.user_mapping:
                with open(user_mapping_path, 'wb') as f:
                    pickle.dump(self.user_mapping, f)
            
            if self.item_mapping:
                with open(item_mapping_path, 'wb') as f:
                    pickle.dump(self.item_mapping, f)
            
            if self.feature_mapping:
                with open(feature_mapping_path, 'wb') as f:
                    pickle.dump(self.feature_mapping, f)
            
            logger.info("Model saved to disk")
            return True
        except Exception as e:
            logger.error(f"Error saving model: {str(e)}")
            return False
    
    def train(self, interactions: sp.coo_matrix, 
              user_features: Optional[sp.csr_matrix] = None, 
              item_features: Optional[sp.csr_matrix] = None) -> Dict[str, Any]:
        """
        Train the recommendation model.
        
        Args:
            interactions: Sparse interaction matrix (users x items)
            user_features: Sparse user feature matrix (optional)
            item_features: Sparse item feature matrix (optional)
        
        Returns:
            Dictionary with training results
        """
        start_time = datetime.now()
        
        # Initialize model with hyperparameters
        model = LightFM(
            no_components=settings.NUM_COMPONENTS,
            learning_rate=settings.LEARNING_RATE,
            loss=settings.LOSS,
            user_alpha=settings.USER_ALPHA,
            item_alpha=settings.ITEM_ALPHA
        )
        
        # Train model
        model.fit(
            interactions=interactions,
            user_features=user_features,
            item_features=item_features,
            epochs=settings.EPOCHS,
            verbose=True
        )
        
        # Save model and features
        self.model = model
        self.user_features = user_features
        self.item_features = item_features
        self.last_trained = datetime.now()
        
        # Calculate training time
        training_time = (datetime.now() - start_time).total_seconds()
        
        # Save model to disk
        self.save_model()
        
        return {
            "training_time": training_time,
            "num_users": interactions.shape[0],
            "num_items": interactions.shape[1],
            "timestamp": self.last_trained.isoformat()
        }
    
    def predict_for_user(self, user_id: str, count: int = 5) -> List[Tuple[str, float]]:
        """
        Generate recommendations for a user.
        
        Args:
            user_id: User ID
            count: Number of recommendations to generate
        
        Returns:
            List of (product_id, score) tuples
        """
        if self.model is None:
            logger.warning("Model not trained yet")
            return []
        
        if user_id not in self.user_mapping:
            logger.warning(f"User {user_id} not in model")
            return []
        
        # Get internal user index
        user_idx = self.user_mapping[user_id]
        
        # Get all item IDs
        item_ids = list(range(len(self.item_mapping)))
        # Create repeated user IDs for each item
        user_ids = np.repeat(user_idx, len(item_ids))
        # Predict scores for all items
        scores = self.model.predict(
            user_ids=user_ids,
            item_ids=item_ids,
            user_features=self.user_features,
            item_features=self.item_features
        )
        
        # Get top items
        top_items = np.argsort(-scores)[:count]
        
        # Convert to product IDs and scores
        recommendations = []
        for idx in top_items:
            if idx in self.reverse_item_mapping:
                product_id = self.reverse_item_mapping[idx]
                recommendations.append((product_id, float(scores[idx])))
        
        return recommendations
    
    def find_similar_items(self, item_id: str, count: int = 5) -> List[Tuple[str, float]]:
        """
        Find items similar to a given item.
        
        Args:
            item_id: Item ID
            count: Number of similar items to find
        
        Returns:
            List of (product_id, similarity_score) tuples
        """
        if self.model is None:
            logger.warning("Model not trained yet")
            return []
        
        if item_id not in self.item_mapping:
            logger.warning(f"Item {item_id} not in model")
            return []
        
        # Get internal item index
        item_idx = self.item_mapping[item_id]
        
        # Get item embeddings
        item_biases, item_embeddings = self.model.get_item_representations(features=self.item_features)
        
        # Get embedding for the target item
        target_embedding = item_embeddings[item_idx]
        
        # Calculate cosine similarity with all other items
        similarities = item_embeddings.dot(target_embedding) / (
            np.linalg.norm(item_embeddings, axis=1) * np.linalg.norm(target_embedding)
        )
        
        # Get top similar items (excluding the item itself)
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
        similar_items = []
        for idx, score in zip(top_similar, top_scores):
            if idx in self.reverse_item_mapping:
                product_id = self.reverse_item_mapping[idx]
                similar_items.append((product_id, float(score)))
        
        return similar_items
