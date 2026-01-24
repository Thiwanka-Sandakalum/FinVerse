import os
import json
import logging
from core.llm_client import GeminiClient
logger = logging.getLogger("llm")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s")
handler.setFormatter(formatter)
if not logger.hasHandlers():
    logger.addHandler(handler)

PROMPT_DIR = os.path.join(os.path.dirname(__file__), '../prompts')
def load_json_prompt(filename):
    with open(os.path.join(PROMPT_DIR, filename), 'r') as f:
        return json.load(f)

SYSTEM_PROMPT = load_json_prompt('system_prompt.json')["system_prompt"]
SQL_PROMPT_JSON = load_json_prompt('user_query_to_sql.json')
RESPONSE_PROMPT_JSON = load_json_prompt('response_prompt.json')

class ChatOrchestrator:
    def __init__(self, chat_repo, product_repo, llm=None):
        self.llm = llm or GeminiClient()
        self.products = product_repo
        self.chat_repo = chat_repo
    def handle_chat(self, session_id, user_id, message: str):
        # 1. Load last 5 messages
        # history = self.chat_repo.get_recent_messages(session_id, limit=5)
        # history_str = "\n".join([
        #     f"{msg.role.capitalize()}: {msg.content}" for msg in history
        # ]) if history else "(No previous messages)"

        # 2. Classify user query to category using LLM
        category_prompt_json = load_json_prompt('category_classification.json')
        category_instruction = category_prompt_json["instruction"]
        categories = category_prompt_json["categories"]
        cat_prompt = (
            category_instruction + "\n\n" +
            "Categories: " + ", ".join(categories) + "\n" +
            f"User Query: {message}\nCategory:"
        )

        try:
            category_raw = self.llm.generate(user_prompt=cat_prompt, context=None).strip()
            # Remove 'Category:' prefix if present, and extra whitespace
            if category_raw.lower().startswith('category:'):
                category = category_raw[len('category:'):].strip()
            else:
                category = category_raw
            logger.info(f"Predicted category: {category}")
        except Exception as e:
            logger.error(f"Category classification failed: {e}")
            category = None

        # 3. Generate filter dict from LLM output
        filter_dict = {"category": category} if category and category != "Other" else None

        # 4. Use filter in vector_search
        try:
            products = self.products.vector_search(query=message, limit=5, filter=filter_dict)
        except Exception as e:
            logger.error(f"Vector search failed: {e}")
            products = []

        def build_context(products):
            formatted = []
            for i, p in enumerate(products, 1):
                details = p.get("details", {})
                formatted.append(
                    f"""
Product {i}
Name: {p.get('name') or p.get('service_name')}
Category: {p.get('category')}
Description: {p.get('description')}
Key Features: {p.get('key_features')}
Eligibility: {details.get('eligibility') or p.get('eligibility')}
Fees or Rates: {details.get('interestRate') or p.get('fees_or_rates')}
Source: {p.get('source_url')}
Similarity Score: {p.get('score')}
"""
                )
            return "\n".join(formatted)

        context = build_context(products) if products else "No relevant products found."

        response_prompt = (
            RESPONSE_PROMPT_JSON["instruction"] + "\n\n" +
            "## Context:\n" +
            # f"Chat History:\n{history_str}\n\n" +
            f"Product Context:\n{context}\n\n" +
            f"## User Question:\n{message}\n\n" +
            RESPONSE_PROMPT_JSON["answer_prefix"]
        )
        logger.info("LLM response prompt:\n%s", response_prompt)
        try:
            reply = self.llm.generate(user_prompt=response_prompt, context=SYSTEM_PROMPT)
            logger.info("LLM response:\n%s", reply)
        except Exception as e:
            logger.error(f"LLM response generation failed: {e}")
            raise

        # 6. Save Q/A to DB
        self.chat_repo.save_message(session_id, user_id, "user", message)
        self.chat_repo.save_message(session_id, user_id, "assistant", reply)

        # 7. Return answer
        return reply
