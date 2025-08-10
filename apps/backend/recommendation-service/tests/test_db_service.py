import pytest
from services.db_service import DBService
from unittest.mock import MagicMock
from typing import AsyncIterator

class AsyncIteratorMock:
    def __init__(self, data):
        self.data = data

    def __aiter__(self):
        return self

    async def __anext__(self):
        if not self.data:
            raise StopAsyncIteration
        return self.data.pop(0)

@pytest.mark.asyncio
async def test_get_most_viewed_products():
    db = MagicMock()
    mock_data = [
        {"_id": "prod-001", "count": 5},
        {"_id": "prod-002", "count": 3}
    ]
    db.interactions.aggregate.return_value = AsyncIteratorMock(mock_data)
    service = DBService(db)
    result = await service.get_most_viewed_products(2)
    assert isinstance(result, list)
    assert len(result) == 2
    assert result[0]["productId"] == "prod-001"
    assert result[0]["count"] == 5
    assert result[1]["productId"] == "prod-002"
    assert result[1]["count"] == 3
