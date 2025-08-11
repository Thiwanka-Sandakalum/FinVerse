"""
Enhanced RabbitMQ consumer for user interaction events.
Receives messages from RabbitMQ and stores them in MongoDB with detailed logging.
"""
import asyncio
import json
import logging
from datetime import datetime
import aio_pika
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

logger = logging.getLogger("recommendation-service")

class InteractionQueueConsumer:
    def __init__(self, mongo_uri: str, mongo_db: str):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db
        self.mongo_client: Optional[AsyncIOMotorClient] = None
        self.db = None
        self.connection: Optional[aio_pika.Connection] = None
        self.channel: Optional[aio_pika.Channel] = None
        self.queues = {}
        self.task = None
        self.running = False

        # Queue configuration to match banking service
        self.rabbitmq_url = "amqp://guest:guest@localhost:5672/"
        self.exchange_name = "interaction_events"
        self.queue_configs = {
            "product_views": "product_views",
            "searches": "searches", 
            "interactions": "interactions",
            "comparisons": "comparisons"
        }

    async def connect_mongodb(self):
        """Connect to MongoDB with enhanced logging"""
        try:
            print(f"🔌 CONNECTING TO MONGODB: {self.mongo_uri}")
            self.mongo_client = AsyncIOMotorClient(self.mongo_uri)
            self.db = self.mongo_client[self.mongo_db]
            
            # Test connection
            await self.mongo_client.admin.command('ping')
            print(f"✅ MONGODB CONNECTED SUCCESSFULLY!")
            logger.info(f"Connected to MongoDB: {self.mongo_uri}")
            
        except Exception as e:
            print(f"❌ MONGODB CONNECTION FAILED: {str(e)}")
            logger.error(f"Failed to connect to MongoDB: {str(e)}")
            raise

    async def connect_rabbitmq(self):
        """Connect to RabbitMQ with enhanced logging"""
        try:
            print(f"🔌 CONNECTING TO RABBITMQ: {self.rabbitmq_url}")
            self.connection = await aio_pika.connect_robust(self.rabbitmq_url)
            self.channel = await self.connection.channel()
            
            # Declare exchange
            exchange = await self.channel.declare_exchange(
                self.exchange_name, 
                aio_pika.ExchangeType.TOPIC,
                durable=True
            )
            
            # Declare and bind queues
            for queue_key, queue_name in self.queue_configs.items():
                queue = await self.channel.declare_queue(queue_name, durable=True)
                await queue.bind(exchange, routing_key=queue_name)
                self.queues[queue_key] = queue
                print(f"✅ QUEUE DECLARED AND BOUND: {queue_name}")
            
            print(f"✅ RABBITMQ CONNECTED SUCCESSFULLY!")
            logger.info(f"Connected to RabbitMQ: {self.rabbitmq_url}")
            
        except Exception as e:
            print(f"❌ RABBITMQ CONNECTION FAILED: {str(e)}")
            logger.error(f"Failed to connect to RabbitMQ: {str(e)}")
            raise

    async def process_message(self, message: aio_pika.IncomingMessage, queue_name: str):
        """Process incoming message with detailed logging"""
        async with message.process():
            try:
                # Decode message
                raw_data = message.body.decode()
                data = json.loads(raw_data)
                
                # Fix timestamp if it's in the wrong format
                if 'timestamp' in data and isinstance(data['timestamp'], str):
                    try:
                        # Parse ISO timestamp and convert to datetime
                        data['timestamp'] = datetime.fromisoformat(data['timestamp'].replace('Z', '+00:00'))
                    except:
                        # Fallback to current time if parsing fails
                        data['timestamp'] = datetime.utcnow()
                elif 'timestamp' in data and isinstance(data['timestamp'], (int, float)):
                    # Convert Unix timestamp to datetime
                    data['timestamp'] = datetime.utcfromtimestamp(data['timestamp'])
                elif 'timestamp' not in data:
                    data['timestamp'] = datetime.utcnow()
                
                # Log received message
                print(f"📥 MESSAGE RECEIVED FROM QUEUE: {queue_name}")
                print(f"📋 Message Data: {json.dumps(data, indent=2, default=str)}")
                
                # Add metadata
                processed_data = {
                    **data,
                    'received_at': datetime.utcnow(),
                    'queue_source': queue_name,
                    'processed_by': 'recommendation-service'
                }
                
                # Store in MongoDB
                result = await self.db.interactions.insert_one(processed_data)
                
                # Log success
                user_id = data.get('userId', 'anonymous')
                action = data.get('action', 'unknown')
                product_id = data.get('productId', data.get('productIds', 'N/A'))
                
                print(f"✅ MESSAGE PROCESSED SUCCESSFULLY!")
                print(f"   📊 User: {user_id}")
                print(f"   🎯 Action: {action}")
                print(f"   📦 Product: {product_id}")
                print(f"   🆔 MongoDB ID: {result.inserted_id}")
                
                logger.info(f"Processed {action} interaction for user {user_id}, product {product_id}")
                
            except json.JSONDecodeError as e:
                print(f"❌ JSON DECODE ERROR: {str(e)}")
                logger.error(f"Failed to decode JSON message: {str(e)}")
            except Exception as e:
                print(f"❌ MESSAGE PROCESSING ERROR: {str(e)}")
                logger.error(f"Failed to process message: {str(e)}")

    async def start_consuming(self):
        """Start consuming messages from all queues"""
        try:
            print(f"🚀 STARTING MESSAGE CONSUMPTION...")
            
            for queue_key, queue in self.queues.items():
                queue_name = self.queue_configs[queue_key]
                
                # Create a handler function for this specific queue
                def make_handler(qname):
                    async def handler(message):
                        await self.process_message(message, qname)
                    return handler
                
                handler = make_handler(queue_name)
                await queue.consume(handler)
                print(f"👂 LISTENING TO QUEUE: {queue_name}")
            
            logger.info("Started consuming from all interaction queues")
            self.running = True
            
            # Keep running
            while self.running:
                await asyncio.sleep(1)
                
        except Exception as e:
            print(f"❌ CONSUMPTION ERROR: {str(e)}")
            logger.error(f"Error in message consumption: {str(e)}")

    async def start(self):
        """Initialize and start the consumer"""
        try:
            await self.connect_mongodb()
            await self.connect_rabbitmq()
            await self.start_consuming()
        except Exception as e:
            logger.error(f"Failed to start queue consumer: {str(e)}")

    async def stop(self):
        """Stop the consumer gracefully"""
        self.running = False
        if self.connection and not self.connection.is_closed:
            await self.connection.close()
        if self.mongo_client:
            self.mongo_client.close()
        logger.info("Queue consumer stopped")

# Global consumer instance
_consumer_instance: Optional[InteractionQueueConsumer] = None

async def get_queue_consumer(mongo_uri: str, mongo_db: str) -> InteractionQueueConsumer:
    """Get or create queue consumer instance"""
    global _consumer_instance
    if _consumer_instance is None:
        _consumer_instance = InteractionQueueConsumer(mongo_uri, mongo_db)
    return _consumer_instance

async def start_queue_consumer(mongo_uri: str, mongo_db: str):
    """Start the queue consumer"""
    consumer = await get_queue_consumer(mongo_uri, mongo_db)
    if not consumer.running:
        # Start in background task
        asyncio.create_task(consumer.start())
        logger.info("Queue consumer started in background")
