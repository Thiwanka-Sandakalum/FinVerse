from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, JSON, UniqueConstraint, Index
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class ProductCategory(Base):
    __tablename__ = "product_categories"

    id = Column(String, primary_key=True)
    parent_id = Column(String, ForeignKey("product_categories.id", ondelete="SET NULL"), nullable=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    level = Column(Integer, default=0)

    # Relationships
    parent = relationship("ProductCategory", remote_side=[id], backref="children")
    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")
    field_definitions = relationship("FieldDefinition", back_populates="category", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_category_parent", "parent_id"),
        Index("idx_category_level", "level"),
    )

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True)
    institution_id = Column(String, nullable=False, index=True)
    category_id = Column(String, ForeignKey("product_categories.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    details = Column(JSON, nullable=True)  # flexible JSON field
    is_featured = Column(Boolean, default=False, index=True)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category = relationship("ProductCategory", back_populates="products")
    saved_products = relationship("SavedProduct", back_populates="product", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_product_institution_active", "institution_id", "is_active"),
        Index("idx_product_category_active", "category_id", "is_active"),
        Index("idx_product_featured_active", "is_featured", "is_active"),
    )

class FieldDefinition(Base):
    __tablename__ = "field_definitions"

    id = Column(String, primary_key=True)
    category_id = Column(String, ForeignKey("product_categories.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False)
    data_type = Column(String, nullable=False)
    is_required = Column(Boolean, default=False)
    validation = Column(JSON, nullable=True)

    category = relationship("ProductCategory", back_populates="field_definitions")

    __table_args__ = (
        UniqueConstraint("category_id", "name", name="uq_category_field"),
    )
