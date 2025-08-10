"""
Async RabbitMQ consumer for user interaction events.
Receives messages from RabbitMQ and stores them in MongoDB.
"""
import asyncio
import json
import logging
import aio_pika
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

logger = logging.getLogger("recommendation-service")

RABBITMQ_URL = "amqp://guest:guest@localhost/"  # Change if needed
QUEUE_NAME = "user_interactions"

class InteractionQueueConsumer:
    def __init__(self, mongo_uri: str, mongo_db: str):
        self.mongo_client = AsyncIOMotorClient(mongo_uri)
        self.db = self.mongo_client[mongo_db]
        self.connection = None
        self.channel = None
        self.queue = None
        self.task = None

    async def connect_rabbitmq(self):
        self.connection = await aio_pika.connect_robust(RABBITMQ_URL)
        self.channel = await self.connection.channel()
        self.queue = await self.channel.declare_queue(QUEUE_NAME, durable=True)
        logger.info(f"Connected to RabbitMQ queue: {QUEUE_NAME}")

    async def process_message(self, message: aio_pika.IncomingMessage):
        async with message.process():
            try:
                data = json.loads(message.body.decode())
                # Insert into MongoDB
                await self.db.interactions.insert_one(data)
                logger.info(f"Inserted interaction for user: {data.get('user_id')}")
            except Exception as e:
                logger.error(f"Failed to process message: {str(e)}")

    async def consume(self):
        await self.connect_rabbitmq()
        await self.queue.consume(self.process_message)
        logger.info("Started consuming user interaction messages.")
        while True:
            await asyncio.sleep(1)

    def start(self):
        self.task = asyncio.create_task(self.consume())

# FastAPI integration example (add to app startup)
queue_consumer = None

def start_queue_consumer():
    global queue_consumer
    if queue_consumer is None:
        queue_consumer = InteractionQueueConsumer(settings.MONGO_URI, settings.MONGO_DB)
        queue_consumer.start()
        logger.info("Queue consumer started.")
