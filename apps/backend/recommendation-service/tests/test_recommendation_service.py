import pytest
from services.recommendation_service import RecommendationService
from unittest.mock import AsyncMock

@pytest.mark.asyncio
async def test_get_recommendations_for_user_cold_start():
    db_service = AsyncMock()
    db_service.get_user_product_interactions.return_value = []
    db_service.get_most_viewed_products.return_value = [
        {"productId": "prod-001", "count": 10},
        {"productId": "prod-002", "count": 8}
    ]
    service = RecommendationService(db_service)
    recs = await service.get_recommendations_for_user("new_user", 2)
    assert len(recs) == 2
    assert recs[0]["id"] == "prod-001"

@pytest.mark.asyncio
async def test_refresh_model_handles_missing_data():
    db_service = AsyncMock()
    db_service.get_user_product_interactions.return_value = []
    service = RecommendationService(db_service)
    result = await service.refresh_model()
    assert isinstance(result, dict)
    assert "success" in result
