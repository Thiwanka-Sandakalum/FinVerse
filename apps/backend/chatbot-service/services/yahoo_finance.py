import yfinance as yf
from functools import lru_cache

class YahooFinanceService:

    @lru_cache(maxsize=1)
    def get_snapshot(self):
        t = yf.Ticker("^IRX")
        return {
            "interestRate": t.info.get("regularMarketPrice")
        }
