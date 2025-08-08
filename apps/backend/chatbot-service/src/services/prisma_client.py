"""
Prisma database connection module.

This module provides a connection to the PostgreSQL database managed by Prisma.
It uses direct SQL queries to fetch data rather than creating and managing models.
"""

import psycopg2
import psycopg2.extras
import json
from src.config.settings import Settings
from typing import List, Dict, Any, Optional
from src.utils.json_utils import process_value

settings = Settings()

class PrismaClient:
    def __init__(self):
        self.conn = None
        
    def get_connection(self):
        """Get a connection to the database."""
        if self.conn is None or self.conn.closed:
            self.conn = psycopg2.connect(
                settings.DATABASE_URL,
                cursor_factory=psycopg2.extras.RealDictCursor
            )
        return self.conn
        
    def close_connection(self):
        """Close the database connection."""
        if self.conn and not self.conn.closed:
            self.conn.close()
    
    def _extract_product_fields(self, product_data):
        """Extract product fields from database result with flexible field mapping."""
        # Parse details JSON field if needed
        details = product_data.get('details', {})
        if isinstance(details, str):
            try:
                details = json.loads(details)
            except json.JSONDecodeError:
                details = {}
        
        # Extract fields with flexible handling of different JSON structures
        # Try multiple possible field names for each attribute
        interest_rate = details.get('interestRate', details.get('baseRate', details.get('rate', details.get('interest', None))))
        
        # Loan amount fields
        loan_amount_min = details.get('loanAmountMin', details.get('minAmount', details.get('minimumAmount', details.get('amountMin', None))))
        loan_amount_max = details.get('loanAmountMax', details.get('maxAmount', details.get('maximumAmount', details.get('amountMax', None))))
        
        # Term fields
        term_min = details.get('termMin', details.get('minTerm', details.get('minimumTerm', details.get('termMonthsMin', None))))
        term_max = details.get('termMax', details.get('maxTerm', details.get('maximumTerm', details.get('termMonthsMax', details.get('termMonths', None)))))
        
        # Lists can be stored in various formats
        requirements = details.get('requirements', details.get('eligibility', details.get('requiredDocuments', [])))
        features = details.get('features', details.get('benefits', details.get('productFeatures', [])))
        
        # Fee related fields
        origination_fee = details.get('originationFee', details.get('fee', details.get('processingFee', details.get('setupFee', None))))
        annual_percentage_rate = details.get('annualPercentageRate', details.get('apr', details.get('effectiveRate', None)))
        
        # Build standardized product dictionary
        product_dict = {
            "id": product_data['id'],
            "name": product_data['name'],
            "description": product_data['product_type_description'],
            "interest_rate": process_value(interest_rate),
            "loan_amount_min": process_value(loan_amount_min),
            "loan_amount_max": process_value(loan_amount_max),
            "term_min": process_value(term_min), 
            "term_max": process_value(term_max),
            "requirements": process_value(requirements),
            "features": process_value(features),
            "origination_fee": process_value(origination_fee),
            "annual_percentage_rate": process_value(annual_percentage_rate),
            "institution": product_data['institution_name'],
            "type": product_data['product_type_name']
        }
        return product_dict
            
    def get_all_products(self) -> List[Dict[str, Any]]:
        """Get all products with their relationships."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        query = """
        SELECT 
            p.id, p.name, p.slug, p.details, p."isFeatured", p."isActive", 
            p."createdAt", p."updatedAt", i.name as institution_name, 
            pt.name as product_type_name, pt.description as product_type_description
        FROM 
            "Product" p
        JOIN 
            "Institution" i ON p."institutionId" = i.id
        JOIN 
            "ProductType" pt ON p."productTypeId" = pt.id
        WHERE 
            p."isActive" = true
        """
        
        cursor.execute(query)
        products = cursor.fetchall()
        
        # Convert query results to a list of dictionaries
        result = []
        for product in products:
            product_dict = self._extract_product_fields(product)
            result.append(product_dict)
            
        cursor.close()
        return result
    
    def get_product_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific product by ID."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        query = """
        SELECT 
            p.id, p.name, p.slug, p.details, p."isFeatured", p."isActive", 
            p."createdAt", p."updatedAt", i.name as institution_name, 
            pt.name as product_type_name, pt.description as product_type_description
        FROM 
            "Product" p
        JOIN 
            "Institution" i ON p."institutionId" = i.id
        JOIN 
            "ProductType" pt ON p."productTypeId" = pt.id
        WHERE 
            p.id = %s AND p."isActive" = true
        """
        
        cursor.execute(query, (product_id,))
        product = cursor.fetchone()
        
        if not product:
            return None
            
        product_dict = self._extract_product_fields(product)
        cursor.close()
        return product_dict
    
    def get_institutions(self) -> List[Dict[str, Any]]:
        """Get all financial institutions."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        query = """
        SELECT id, name, slug, "logoUrl", "licenseNumber", "countryCode", "isActive"
        FROM "Institution"
        WHERE "isActive" = true
        """
        
        cursor.execute(query)
        institutions = cursor.fetchall()
        cursor.close()
        
        return institutions
    
    def get_products_by_type(self, type_name: str) -> List[Dict[str, Any]]:
        """Get products by their type name."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        query = """
        SELECT 
            p.id, p.name, p.slug, p.details, p."isFeatured", p."isActive", 
            p."createdAt", p."updatedAt", i.name as institution_name, 
            pt.name as product_type_name, pt.description as product_type_description
        FROM 
            "Product" p
        JOIN 
            "Institution" i ON p."institutionId" = i.id
        JOIN 
            "ProductType" pt ON p."productTypeId" = pt.id
        WHERE 
            pt.name = %s AND p."isActive" = true
        """
        
        cursor.execute(query, (type_name,))
        products = cursor.fetchall()
        
        # Convert query results to a list of dictionaries
        result = []
        for product in products:
            product_dict = self._extract_product_fields(product)
            result.append(product_dict)
            
        cursor.close()
        return result
