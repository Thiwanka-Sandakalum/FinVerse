from datetime import datetime

class APIResponse:
    @staticmethod
    def success(data):
        return {
            "success": True,
            "message": "OK",
            "data": data,
            "meta": {
                "timestamp": datetime.utcnow().isoformat()
            }
        }
