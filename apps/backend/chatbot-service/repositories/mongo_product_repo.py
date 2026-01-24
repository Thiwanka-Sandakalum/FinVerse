from pymongo.collection import Collection
from typing import List, Optional

class MongoProductRepository:
	def __init__(self, collection: Collection, embedding_client):
		"""
		Initialize the MongoProductRepository.
		:param collection: MongoDB collection instance
		:param embedding_client: Embedding client instance with an embed(text) method
		"""
		self.collection = collection
		self.embedding_client = embedding_client

	def get_query_embedding(self, query: str) -> List[float]:
		embedding = self.embedding_client.embed(query)
		print("Embedding length:", len(embedding))  # Debug: check dimension
		return embedding

	def vector_search(self, query: str, num_candidates: int = 200, limit: int = 5, filter: Optional[dict] = None) -> list:
		vector_search_stage = {
			"$vectorSearch": {
				"index": "vector_index_finvserv",
				"path": "embedding",
				"queryVector": self.get_query_embedding(query),
				"numCandidates": num_candidates,
				"limit": limit
			}
		}
		if filter:
			vector_search_stage["$vectorSearch"]["filter"] = filter
		pipeline = [vector_search_stage]
		results = list(self.collection.aggregate(pipeline))
		for doc in results:
			print(doc.get("name"), doc.get("score"))  # Debug: print scores
		return results

	def get_relevant_products(self, limit: int = 3, filter: Optional[dict] = None) -> list:
		query = filter or {"isActive": True}
		return list(self.collection.find(query).limit(limit))
