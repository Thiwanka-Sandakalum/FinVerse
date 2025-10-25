import json
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path="../.env")

# Path to your seed file
SEED_FILE = "./seed_interactions.json"

# MongoDB connection details from environment variables
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("MONGO_DB", "finverse_interactions")
COLLECTION_NAME = "interactions"

def main():
    # Validate environment variables
    if not MONGO_URI:
        print("❌ ERROR: MONGO_URI environment variable not found!")
        print("Make sure the .env file exists and contains MONGO_URI")
        return
    
    if not DB_NAME:
        print("❌ ERROR: MONGO_DB environment variable not found!")
        return
    
    print(f"📋 Database: {DB_NAME}")
    print(f"🔗 URI: {MONGO_URI[:50]}{'...' if len(MONGO_URI) > 50 else ''}")
    print("-" * 60)
    
    try:
        # Load seed data
        print(f"📂 Loading seed data from {SEED_FILE}...")
        with open(SEED_FILE, "r") as f:
            data = json.load(f)
        print(f"✅ Loaded {len(data)} records from seed file")

        # Connect to MongoDB
        print("🔌 Connecting to MongoDB...")
        client = MongoClient(MONGO_URI)
        
        # Test connection
        client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]

        # Check if collection already has data
        existing_count = collection.count_documents({})
        if existing_count > 0:
            print(f"⚠️  Collection '{COLLECTION_NAME}' already contains {existing_count} documents")
            response = input("Do you want to continue and add more data? (y/n): ")
            if response.lower() != 'y':
                print("❌ Operation cancelled")
                return

        # Insert data
        print(f"💾 Inserting data into '{COLLECTION_NAME}' collection...")
        result = collection.insert_many(data)
        print(f"✅ Successfully inserted {len(result.inserted_ids)} documents!")
        
        # Verify insertion
        total_count = collection.count_documents({})
        print(f"📊 Total documents in collection: {total_count}")
        
        client.close()
        print("🎉 Seed operation completed successfully!")
        
    except FileNotFoundError:
        print(f"❌ ERROR: Seed file '{SEED_FILE}' not found!")
        print("Make sure the seed_interactions.json file exists in the current directory")
    except json.JSONDecodeError as e:
        print(f"❌ ERROR: Invalid JSON in seed file: {e}")
    except Exception as e:
        print(f"❌ ERROR: Failed to seed database: {e}")
        print("Check your MongoDB connection and credentials")

if __name__ == "__main__":
    main()