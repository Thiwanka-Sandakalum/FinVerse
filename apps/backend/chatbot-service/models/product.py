from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class ProductCategory(Base):
    __tablename__ = "productcategory"

    id = Column(String, primary_key=True)
    parentId = Column(String, ForeignKey("productcategory.id"), nullable=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=True)
    level = Column(Integer, nullable=False, default=0)

    parent = relationship("ProductCategory", remote_side=[id], backref="children")
    products = relationship("Product", back_populates="category", foreign_keys='Product.categoryId')

class Product(Base):
    __tablename__ = "product"

    id = Column(String, primary_key=True)
    institutionId = Column(String, nullable=False)
    categoryId = Column(String, ForeignKey("productcategory.id"), nullable=False)
    name = Column(String, nullable=False, index=True)
    details = Column(JSON, nullable=True)
    isFeatured = Column(Boolean, nullable=False, default=False, index=True)
    isActive = Column(Boolean, nullable=False, default=True)
    createdAt = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    updatedAt = Column(DateTime, nullable=True, onupdate=datetime.utcnow)

    category = relationship("ProductCategory", back_populates="products", foreign_keys=[categoryId])
