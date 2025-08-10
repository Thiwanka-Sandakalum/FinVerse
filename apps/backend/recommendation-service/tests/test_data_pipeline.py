import pytest
from models.data_pipeline import DataPipeline
import numpy as np
import scipy.sparse as sp

@pytest.mark.asyncio
async def test_prepare_interaction_data_empty():
    class DummyDB:
        async def get_user_product_interactions(self, limit=50000):
            return []
        async def get_user_preferences(self, user_id):
            return None
    dp = DataPipeline()
    result = await dp.prepare_interaction_data(DummyDB())
    assert isinstance(result, tuple)
    assert isinstance(result[0], sp.coo_matrix)
