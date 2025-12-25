"""
Prisma database connection module.

This module provides a connection to the MySQL database managed by Prisma.
It uses direct SQL queries to fetch data rather than creating and managing models.
"""

import mysql.connector
from mysql.connector.cursor import MySQLCursorDict
import json
import os
from src.config.settings import Settings
from typing import List, Dict, Any, Optional
from src.utils.json_utils import process_value

# Instantiate Settings; if the Settings constructor requires explicit parameters,
# fall back to building it from environment variables.
try:
    settings = Settings()
except TypeError:
    settings = Settings(
        DATABASE_HOST=os.getenv("DATABASE_HOST"),
        DATABASE_PORT=int(os.getenv("DATABASE_PORT")) if os.getenv("DATABASE_PORT") else None,
        DATABASE_USER=os.getenv("DATABASE_USER"),
        DATABASE_PASSWORD=os.getenv("DATABASE_PASSWORD"),
        DATABASE_NAME=os.getenv("DATABASE_NAME"),
        DATABASE_SSL_MODE=os.getenv("DATABASE_SSL_MODE"),
        GOOGLE_API_KEY=os.getenv("GOOGLE_API_KEY"),
    )
    
class DatabaseService:
    def __init__(self):
        self.conn = None
        
    def get_connection(self):
        """Get a connection to the database."""
        if self.conn is None:
            
            self.conn = mysql.connector.connect(
                host=settings.DATABASE_HOST,
                port=settings.DATABASE_PORT,
                user=settings.DATABASE_USER,
                password=settings.DATABASE_PASSWORD,
                database=settings.DATABASE_NAME
            )
        return self.conn
        
    def close_connection(self):
        """Close the database connection."""
        if self.conn:
            self.conn.close()
            self.conn = None
           
    def get_all_products(self) -> List[Dict[str, Any]]:
        """Get all products with their relationships."""
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = """
        SELECT 
            p.id, p.name, p.slug, p.details, p.isFeatured, p.isActive, 
            p.createdAt, p.updatedAt, i.name as institution_name, 
            pt.name as product_type_name, pt.description as product_type_description
        FROM 
            Product p
        JOIN 
            Institution i ON p.institutionId = i.id
        JOIN 
            ProductType pt ON p.productTypeId = pt.id
        WHERE 
            p.isActive = 1
        """
        
        cursor.execute(query)
        products = cursor.fetchall()
        
        # Convert query results to a list of dictionaries
        result = []
        for product in products:
            result.append(product)

        cursor.close()
        return result
    
    def get_product_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific product by ID."""
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = """
        SELECT 
            p.id, p.name, p.slug, p.details, p.isFeatured, p.isActive, 
            p.createdAt, p.updatedAt, i.name as institution_name, 
            pt.name as product_type_name, pt.description as product_type_description
        FROM 
            Product p
        JOIN 
            Institution i ON p.institutionId = i.id
        JOIN 
            ProductType pt ON p.productTypeId = pt.id
        WHERE 
            p.id = %s AND p.isActive = 1
        """
        
        cursor.execute(query, (product_id,))
        product = cursor.fetchone()
        
        if not product:
            return None
        return product
    
