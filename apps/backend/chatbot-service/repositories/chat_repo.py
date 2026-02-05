

from typing import List, Optional

class ChatRepository:
	def __init__(self, collection):
		self.collection = collection

	def save_message(self, session_id: str, user_id: str, role: str, content: str, products: Optional[List[str]] = None):
		doc = {
			"session_id": session_id,
			"user_id": user_id,
			"role": role,
			"content": content,
			"product_refs": products or [],
		}
		self.collection.insert_one(doc)
		return doc

	def get_recent_messages(self, session_id: str, limit: int = 5):
		cursor = self.collection.find({"session_id": session_id}).sort("_id", -1).limit(limit)
		return list(cursor)

	def get_session_metadata(self, session_id: str):
		# Example: return last products or category from session
		last_msg = self.collection.find_one({"session_id": session_id}, sort=[("_id", -1)])
		if last_msg:
			return {
				"last_products": last_msg.get("product_refs", []),
				"last_category": last_msg.get("category", None),
				"last_products_full": last_msg.get("products_full", [])
			}
		return {}
