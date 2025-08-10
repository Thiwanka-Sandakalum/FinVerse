import pytest
from models.hybrid_model import HybridRecommendationModel
import numpy as np
import scipy.sparse as sp

@pytest.mark.asyncio
async def test_train_and_predict():
    model = HybridRecommendationModel()
    # Create dummy data
    interactions = sp.coo_matrix(np.array([[1, 0], [0, 1]]))
    user_features = sp.csr_matrix(np.array([[1, 0], [0, 1]]))
    item_features = sp.csr_matrix(np.array([[1, 0], [0, 1]]))
    
    result = model.train(interactions, user_features, item_features)
    assert "training_time" in result
    
    # Set up mappings for prediction
    model.user_mapping = {"user1": 0, "user2": 1}
    model.reverse_item_mapping = {0: "item1", 1: "item2"}
    model.item_mapping = {"item1": 0, "item2": 1}
    model.user_features = user_features
    model.item_features = item_features
    
    # Test prediction for both items
    recs = model.predict_for_user("user1", count=2)
    assert isinstance(recs, list)
    assert len(recs) == 2
    assert all(isinstance(rec, tuple) and len(rec) == 2 for rec in recs)
    assert all(isinstance(rec[0], str) and isinstance(rec[1], float) for rec in recs)
