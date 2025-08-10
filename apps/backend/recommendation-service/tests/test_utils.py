import pytest
from utils.data_processing import calculate_metrics, preprocess_interaction_data

def test_calculate_metrics():
    true_interactions = [("u1", "i1"), ("u1", "i2"), ("u2", "i3")]
    predicted_interactions = [("u1", "i1", 0.9), ("u1", "i3", 0.8), ("u2", "i3", 0.7)]
    metrics = calculate_metrics(true_interactions, predicted_interactions, k=2)
    assert "precision@2" in metrics
    assert "recall@2" in metrics
    assert "f1@2" in metrics

def test_preprocess_interaction_data():
    interactions = [
        {"user_id": "u1", "type": "product_view", "data": {"productId": "i1"}},
        {"user_id": "u2", "type": "comparison", "data": {"productIDs": ["i2", "i3"]}}
    ]
    df = preprocess_interaction_data(interactions)
    assert "user_id" in df.columns
    assert "item_id" in df.columns
    assert len(df) == 3
