


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
    def __init__(self, chat_repo, product_repo, finance_service, llm=None):
        self.llm = llm or GeminiClient()
        self.products = product_repo
        self.chat_repo = chat_repo
        self.finance = finance_service

    def handle_chat(self, session_id, user_id, message: str):
        # 1. Load last 5 messages
        history = self.chat_repo.get_recent_messages(session_id, limit=5)
        history_str = "\n".join([
            f"{msg.role.capitalize()}: {msg.content}" for msg in history
        ]) if history else "(No previous messages)"

        # 2. Generate SQL WHERE clause from user message using LLM
        sql_prompt = (
            SQL_PROMPT_JSON["instruction"] + "\n" +
            "# Product Table Schema:\n" +
            "products(" + ", ".join(SQL_PROMPT_JSON["schema"]["products"]) + ")\n" +
            "product_categories(" + ", ".join(SQL_PROMPT_JSON["schema"]["product_categories"]) + ")\n" +
            f"# Example:\nUser: {SQL_PROMPT_JSON['example']['user']}\nSQL: {SQL_PROMPT_JSON['example']['sql']}\n" +
            f"# Now, generate a SQL WHERE clause for this user question:\nUser: {message}\nSQL:"
        )
        logger.info("LLM SQL prompt:\n%s", sql_prompt)
        sql_where = self.llm.generate(user_prompt=sql_prompt, context=SYSTEM_PROMPT)
        logger.info("LLM SQL response:\n%s", sql_where)
        # Clean up LLM output: remove code block markers and leading SQL:
        sql_where = sql_where.strip()
        if sql_where.startswith('```sql'):
            sql_where = sql_where[6:]
        if sql_where.startswith('```'):
            sql_where = sql_where[3:]
        sql_where = sql_where.replace('```', '').strip()
        sql_where = sql_where.split('\n')[0].replace('SQL:', '').strip()

        # 3. Fetch relevant products using generated SQL (fallback to default if fails)
        try:
            products = self.products.get_by_sql_where(sql_where, limit=5)
        except Exception:
            products = self.products.get_relevant_products(limit=3)

        product_summary = "\n".join([
            f"{getattr(p, 'name', '')}: {getattr(p, 'details', '')}" for p in products
        ]) if products else "(No relevant products)"

        # 4. Fetch Yahoo Finance snapshot (optional)
        market = self.finance.get_snapshot()
        market_str = f"Interest Rate: {market.get('interestRate', 'N/A')}" if market else "(No market data)"

        # 5. Compose response prompt
        # Build response prompt from JSON template
        response_prompt = (
            RESPONSE_PROMPT_JSON["instruction"] + "\n\n" +
            "## Context:\n" +
            f"Chat History:\n{history_str}\n\n" +
            f"Product Summary:\n{product_summary}\n\n" +
            f"Finance Snapshot:\n{market_str}\n\n" +
            f"## User Question:\n{message}\n\n" +
            RESPONSE_PROMPT_JSON["answer_prefix"]
        )
        logger.info("LLM response prompt:\n%s", response_prompt)
        reply = self.llm.generate(user_prompt=response_prompt, context=SYSTEM_PROMPT)
        logger.info("LLM response:\n%s", reply)

        # 6. Save Q/A to DB
        self.chat_repo.save_message(session_id, user_id, "user", message)
        self.chat_repo.save_message(session_id, user_id, "assistant", reply)

        # 7. Return answer
        return reply
