"""
Utility functions for data processing and model evaluation.
"""
import numpy as np
from typing import List, Dict, Tuple, Any
import pandas as pd
from sklearn.metrics import precision_score, recall_score, f1_score

def calculate_metrics(true_interactions: List[Tuple[str, str]], 
                     predicted_interactions: List[Tuple[str, str, float]],
                     k: int = 5) -> Dict[str, float]:
    """
    Calculate evaluation metrics for the recommendation model.
    
    Args:
        true_interactions: List of (user_id, item_id) tuples representing actual interactions
        predicted_interactions: List of (user_id, item_id, score) tuples representing predicted interactions
        k: Number of recommendations per user to consider
        
    Returns:
        Dict containing precision@k, recall@k, and f1@k metrics
    """
    # Convert true interactions to a set for fast lookup
    true_set = set((u, i) for u, i in true_interactions)
    
    # Group predictions by user
    user_predictions = {}
    for u, i, s in predicted_interactions:
        if u not in user_predictions:
            user_predictions[u] = []
        user_predictions[u].append((i, s))
    
    # For each user, sort predictions by score and take top k
    precision_at_k = []
    recall_at_k = []
    f1_at_k = []
    
    for u in user_predictions:
        # Sort predictions by score (descending)
        sorted_predictions = sorted(user_predictions[u], key=lambda x: x[1], reverse=True)
        
        # Take top k predictions
        top_k = sorted_predictions[:k]
        
        # Calculate metrics
        true_items = set(i for u_true, i in true_set if u_true == u)
        pred_items = set(i for i, _ in top_k)
        
        if not true_items:
            continue  # Skip users with no true interactions
        
        # Calculate precision@k and recall@k
        num_hits = len(true_items.intersection(pred_items))
        precision = num_hits / k if k > 0 else 0
        recall = num_hits / len(true_items) if true_items else 0
        
        # Calculate F1 score
        f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
        
        precision_at_k.append(precision)
        recall_at_k.append(recall)
        f1_at_k.append(f1)
    
    # Calculate average metrics
    avg_precision = np.mean(precision_at_k) if precision_at_k else 0
    avg_recall = np.mean(recall_at_k) if recall_at_k else 0
    avg_f1 = np.mean(f1_at_k) if f1_at_k else 0
    
    return {
        f"precision@{k}": avg_precision,
        f"recall@{k}": avg_recall,
        f"f1@{k}": avg_f1
    }

def preprocess_interaction_data(interactions: List[Dict[str, Any]]) -> pd.DataFrame:
    """
    Preprocess interaction data into a pandas DataFrame.
    
    Args:
        interactions: List of interaction documents from the database
        
    Returns:
        Pandas DataFrame with user_id, item_id, and weight columns
    """
    data = []
    
    for interaction in interactions:
        user_id = interaction.get("user_id")
        if not user_id:
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
                data.append({
                    "user_id": user_id,
                    "item_id": product_id,
                    "weight": weight,
                    "timestamp": interaction.get("timestamp")
                })
            elif "productIDs" in interaction["data"] and interaction["data"]["productIDs"]:
                for pid in interaction["data"]["productIDs"]:
                    data.append({
                        "user_id": user_id,
                        "item_id": pid,
                        "weight": weight,
                        "timestamp": interaction.get("timestamp")
                    })
    
    return pd.DataFrame(data)

def split_interaction_data(df: pd.DataFrame, test_size: float = 0.2) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Split interaction data into training and testing sets.
    
    Args:
        df: DataFrame with user-item interactions
        test_size: Proportion of data to use for testing
        
    Returns:
        Tuple of (train_df, test_df)
    """
    # Sort by timestamp
    if "timestamp" in df.columns:
        df = df.sort_values("timestamp")
    
    # Group by user
    grouped = df.groupby("user_id")
    
    train_data = []
    test_data = []
    
    for _, group in grouped:
        n = len(group)
        
        if n <= 1:
            train_data.append(group)  # Keep users with only one interaction in training set
            continue
        
        # Take the last test_size% of interactions for each user as test set
        split_idx = int(n * (1 - test_size))
        
        train_data.append(group.iloc[:split_idx])
        test_data.append(group.iloc[split_idx:])
    
    train_df = pd.concat(train_data) if train_data else pd.DataFrame(columns=df.columns)
    test_df = pd.concat(test_data) if test_data else pd.DataFrame(columns=df.columns)
    
    return train_df, test_df

def create_feature_matrix(df: pd.DataFrame, feature_cols: List[str]) -> Dict[str, Dict[str, float]]:
    """
    Create feature dictionaries from a DataFrame.
    
    Args:
        df: DataFrame with feature columns
        feature_cols: List of column names to use as features
        
    Returns:
        Dict mapping IDs to feature dictionaries
    """
    feature_dict = {}
    
    for _, row in df.iterrows():
        item_id = row["id"]
        feature_dict[item_id] = {}
        
        for col in feature_cols:
            if pd.notna(row[col]):
                if isinstance(row[col], (list, tuple)):
                    # Handle list features (e.g., tags)
                    for val in row[col]:
                        feature_key = f"{col}:{val}"
                        feature_dict[item_id][feature_key] = 1.0
                else:
                    # Handle scalar features
                    feature_key = f"{col}:{row[col]}"
                    feature_dict[item_id][feature_key] = 1.0
    
    return feature_dict
