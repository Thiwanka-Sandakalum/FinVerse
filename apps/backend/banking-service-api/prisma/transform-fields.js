const fs = require('fs');
const path = require('path');

// Read the input files
const productFields = require('./product_fields.json');
const seedData = require('./seed.json');

// Function to find category ID by name and subcategory
function findCategoryId(categories, categoryName, subCategoryName) {
    // Flatten categories if it's an array of arrays
    const flatCategories = Array.isArray(categories[0]) ? categories[0] : categories;

    // First find the subcategory
    const subCategory = flatCategories.find(cat =>
        cat.name === subCategoryName &&
        cat.parentId !== null
    );

    if (!subCategory) {
        console.warn(`Warning: Could not find subcategory: ${subCategoryName}`);
        return null;
    }

    return subCategory.id;
}// Transform field definitions
const fieldDefinitions = [];
let fieldCounter = 1;

productFields.forEach(category => {
    const categoryId = findCategoryId(
        seedData.productCategories,
        category.categoryName,
        category.subCategoryName
    );

    if (!categoryId) {
        console.warn(`Skipping fields for ${category.categoryName} - ${category.subCategoryName} due to missing category ID`);
        return;
    }

    category.fields.forEach(field => {
        // Create a unique slug by combining category and field slug
        const categorySlug = category.subCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const uniqueSlug = `${categorySlug}-${field.slug}`;

        const fieldDef = {
            id: `field-${String(fieldCounter).padStart(3, '0')}`,
            categoryId: categoryId,
            name: field.name,
            slug: uniqueSlug,
            dataType: field.dataType,
            isRequired: field.isRequired || false,
            options: field.options || [],
            validation: field.validation || null
        };

        fieldDefinitions.push(fieldDef);
        fieldCounter++;
    });
});

// Update the seed data
seedData.fieldDefinitions = fieldDefinitions;

// Write the updated seed data back to the file
fs.writeFileSync(
    path.join(__dirname, 'seed.json'),
    JSON.stringify(seedData, null, 4),
    'utf8'
);

console.log(`Successfully added ${fieldDefinitions.length} field definitions to seed.json`);
