const fs = require('fs');
const path = require('path');

// Read the input files
const categories = require('./categories.json');
const seedData = require('./seed.json');

// Update the seed data with categories
// Note: categories.json is already in the correct format, no need for transformation
seedData.productCategories = categories;

// Write the updated seed data back to the file
fs.writeFileSync(
    path.join(__dirname, 'seed.json'),
    JSON.stringify(seedData, null, 4),
    'utf8'
);

console.log(`Successfully added ${categories.length} categories to seed.json`);
