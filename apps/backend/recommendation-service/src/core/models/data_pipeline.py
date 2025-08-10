"""
Data processing pipeline for the recommendation system.

This module handles extracting, transforming, and loading data from the 
interaction service database into the format required by the recommendation model.
"""
import numpy as np
import pandas as pd
import scipy.sparse as sp
from typing import List, Dict, Any, Tuple, Optional
from datetime import datetime
from lightfm.data import Dataset

from src.core.logging import get_logger

logger = get_logger(__name__)

class DataPipeline:
    """Data processing pipeline for the recommendation system"""
    
    @staticmethod
    async def prepare_interaction_data(db_service) -> Tuple[
        sp.coo_matrix, sp.csr_matrix, sp.csr_matrix, Dict[str, int], Dict[str, int]
    ]:
        """
        Extract and prepare interaction data for the recommendation model.
        
        Args:
            db_service: Database service for fetching data
        
        Returns:
            Tuple of (
                interaction_matrix,
                user_features,
                item_features,
                user_mapping,
                item_mapping
            )
        """
        logger.info("Preparing interaction data")
        
        # Retrieve data
        user_product_interactions = await db_service.get_user_product_interactions(limit=50000)
        
        # Handle empty dataset
        if not user_product_interactions:
            # Create empty matrices with minimum dimensions (1,1) to avoid normalization errors
            empty_matrix = sp.coo_matrix((1, 1))
            empty_features = sp.csr_matrix((1, 1))
            empty_mapping = {"default": 0}
            return empty_matrix, empty_features, empty_features, empty_mapping, empty_mapping

        logger.info(f"Retrieved {len(user_product_interactions)} interactions")
        
        # Create dataset
        dataset = Dataset()
        
        # Extract unique users and items
        users = set()
        items = set()
        user_features_dict = {}
        item_features_dict = {}
        
        for interaction in user_product_interactions:
            user_id = interaction.get("user_id")
            if not user_id:
                continue
            
            # Extract product ID
            product_id = None
            if "data" in interaction:
                # For product views
                if "productId" in interaction["data"]:
                    product_id = interaction["data"]["productId"]
                    
                # For comparison events
                elif "productIDs" in interaction["data"] and interaction["data"]["productIDs"]:
                    for pid in interaction["data"]["productIDs"]:
                        items.add(pid)
                        if pid not in item_features_dict:
                            item_features_dict[pid] = set()
            
            if product_id:
                items.add(product_id)
                
                if product_id not in item_features_dict:
                    item_features_dict[product_id] = set()
                
                # Extract product features
                if "data" in interaction:
                    # Add product category if available
                    if "category" in interaction["data"]:
                        category = interaction["data"]["category"]
                        item_features_dict[product_id].add(f"category:{category}")
                    
                    # Add product type if available
                    if "type" in interaction["data"]:
                        prod_type = interaction["data"]["type"]
                        item_features_dict[product_id].add(f"type:{prod_type}")
                    
                    # Add institution if available
                    if "institution" in interaction["data"]:
                        institution = interaction["data"]["institution"]
                        item_features_dict[product_id].add(f"institution:{institution}")
            
            # Extract user features
            users.add(user_id)
            
            if user_id not in user_features_dict:
                user_features_dict[user_id] = set()
            
            # Add interaction type as feature
            interaction_type = interaction.get("type")
            if interaction_type:
                user_features_dict[user_id].add(f"action:{interaction_type}")
            
            # Add user demographic features if available
            if "data" in interaction and "userDemographics" in interaction["data"]:
                demographics = interaction["data"]["userDemographics"]
                
                if "age_group" in demographics:
                    user_features_dict[user_id].add(f"age_group:{demographics['age_group']}")
                
                if "income_range" in demographics:
                    user_features_dict[user_id].add(f"income_range:{demographics['income_range']}")
                
                if "credit_score_range" in demographics:
                    user_features_dict[user_id].add(
                        f"credit_score_range:{demographics['credit_score_range']}")
                        
                if "risk_tolerance" in demographics:
                    user_features_dict[user_id].add(
                        f"risk_tolerance:{demographics['risk_tolerance']}")
        
        # Get user preferences
        for user_id in list(users):
            user_prefs = await db_service.get_user_preferences(user_id)
            if user_prefs and "data" in user_prefs and "preferences" in user_prefs["data"]:
                preferences = user_prefs["data"]["preferences"]
                
                for key, value in preferences.items():
                    user_features_dict[user_id].add(f"preference:{key}:{value}")
        
        # Collect all user and item features
        all_user_features = set()
        for features in user_features_dict.values():
            all_user_features.update(features)
            
        all_item_features = set()
        for features in item_features_dict.values():
            all_item_features.update(features)
        
        # Fit dataset
        logger.info(f"Fitting dataset with {len(users)} users and {len(items)} items")
        dataset.fit(
            users=list(users),
            items=list(items),
            user_features=all_user_features,
            item_features=all_item_features
        )
        
        # Get mappings
        user_mapping = dataset.mapping()[0]
        item_mapping = dataset.mapping()[2]
        
        # Build interaction matrix
        interactions = []
        
        for interaction in user_product_interactions:
            user_id = interaction.get("user_id")
            if not user_id or user_id not in user_mapping:
                continue
                
            # Get interaction weight based on type
            weight = 1.0
            if interaction["type"] == "product_view":
                weight = 1.0
                # Add more weight for longer views
                if "data" in interaction and "viewDuration" in interaction["data"]:
                    view_duration = interaction["data"]["viewDuration"]
                    if view_duration > 60:  # More than 1 minute
                        weight = 1.5
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
                    if product_id in item_mapping:
                        interactions.append((
                            user_mapping[user_id],
                            item_mapping[product_id],
                            weight
                        ))
                elif "productIDs" in interaction["data"] and interaction["data"]["productIDs"]:
                    for pid in interaction["data"]["productIDs"]:
                        if pid in item_mapping:
                            interactions.append((
                                user_mapping[user_id],
                                item_mapping[pid],
                                weight
                            ))
        
        # Create sparse interaction matrix
        interaction_matrix = sp.coo_matrix(
            (
                [i[2] for i in interactions],
                ([i[0] for i in interactions], [i[1] for i in interactions])
            ),
            shape=(len(user_mapping), len(item_mapping))
        )
        
        # Build user and item feature matrices
        user_features = dataset.build_user_features(
            ((uid, list(features)) for uid, features in user_features_dict.items() if uid in user_mapping),
            normalize=True
        )
        
        item_features = dataset.build_item_features(
            ((pid, list(features)) for pid, features in item_features_dict.items() if pid in item_mapping),
            normalize=True
        )
        
        logger.info(f"Created interaction matrix with shape {interaction_matrix.shape}")
        logger.info(f"Created user features with shape {user_features.shape}")
        logger.info(f"Created item features with shape {item_features.shape}")
        
        return interaction_matrix, user_features, item_features, user_mapping, item_mapping
    
    @staticmethod
    def split_train_test(interactions: sp.coo_matrix, test_ratio: float = 0.2) -> Tuple[sp.coo_matrix, sp.coo_matrix]:
        """
        Split interaction data into training and testing sets.
        
        Args:
            interactions: Sparse interaction matrix
            test_ratio: Proportion of interactions to use for testing
            
        Returns:
            Tuple of (train_interactions, test_interactions)
        """
        # Convert to COO format for easy manipulation
        if not isinstance(interactions, sp.coo_matrix):
            interactions = interactions.tocoo()
        
        # Get number of interactions
        num_interactions = interactions.data.shape[0]
        
        # Create random mask for test set
        rng = np.random.RandomState(42)
        test_mask = rng.rand(num_interactions) < test_ratio
        
        # Split interactions
        train_data = interactions.data[~test_mask]
        train_row = interactions.row[~test_mask]
        train_col = interactions.col[~test_mask]
        
        test_data = interactions.data[test_mask]
        test_row = interactions.row[test_mask]
        test_col = interactions.col[test_mask]
        
        # Create train and test matrices
        train_interactions = sp.coo_matrix(
            (train_data, (train_row, train_col)),
            shape=interactions.shape
        )
        
        test_interactions = sp.coo_matrix(
            (test_data, (test_row, test_col)),
            shape=interactions.shape
        )
        
        return train_interactions, test_interactions
    
    @staticmethod
    def evaluate_model(model, test_interactions: sp.coo_matrix, 
                       user_features: Optional[sp.csr_matrix] = None, 
                       item_features: Optional[sp.csr_matrix] = None,
                       k: int = 10) -> Dict[str, float]:
        """
        Evaluate the recommendation model.
        
        Args:
            model: Trained LightFM model
            test_interactions: Test interaction matrix
            user_features: User features matrix (optional)
            item_features: Item features matrix (optional)
            k: Number of recommendations to consider
            
        Returns:
            Dict with evaluation metrics
        """
        # Convert test interactions to COO format
        test_coo = test_interactions.tocoo()
        
        # Calculate precision@k and recall@k for each user
        precision_at_k = []
        recall_at_k = []
        
        # Get all unique users in test set
        test_users = np.unique(test_coo.row)
        
        for user_id in test_users:
            # Get all items the user interacted with in the test set
            true_items = test_coo.col[test_coo.row == user_id]
            
            if len(true_items) == 0:
                continue
            
            # Predict scores for all items
            scores = model.predict(
                user_ids=user_id,
                item_ids=np.arange(test_interactions.shape[1]),
                user_features=user_features,
                item_features=item_features
            )
            
            # Get top k recommendations
            top_items = np.argsort(-scores)[:k]
            
            # Calculate metrics
            n_relevant = len(np.intersect1d(top_items, true_items))
            precision = n_relevant / k
            recall = n_relevant / len(true_items)
            
            precision_at_k.append(precision)
            recall_at_k.append(recall)
        
        # Calculate mean metrics
        mean_precision = np.mean(precision_at_k) if precision_at_k else 0
        mean_recall = np.mean(recall_at_k) if recall_at_k else 0
        
        # Calculate F1 score
        if mean_precision + mean_recall > 0:
            f1 = 2 * mean_precision * mean_recall / (mean_precision + mean_recall)
        else:
            f1 = 0
        
        return {
            f"precision@{k}": float(mean_precision),
            f"recall@{k}": float(mean_recall),
            f"f1@{k}": float(f1)
        }
