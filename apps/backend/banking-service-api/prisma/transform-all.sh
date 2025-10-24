#!/bin/bash

# Navigate to the prisma directory
cd "$(dirname "$0")"

# Run the transformation script
node transform-categories.js

# Check if the script ran successfully
if [ $? -eq 0 ]; then
    echo "✅ Successfully transformed categories"
    echo "🔄 Now running field definitions transformation..."
    
    # Run the fields transformation after categories
    node transform-fields.js
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully transformed field definitions"
        echo "💡 You can now run 'npx prisma db seed' to apply these changes"
    else
        echo "❌ Error: Failed to transform field definitions"
        exit 1
    fi
else
    echo "❌ Error: Failed to transform categories"
    exit 1
fi
