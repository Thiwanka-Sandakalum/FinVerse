"""
Domain service for recommendation logic.
"""
import logging
from datetime import datetime
from typing import Dict, List, Optional

from ..entities.recommendation_entities import (
    ModelRefreshResult, 
    ProductRecommendation, 
    RecommendationModelInterface,
    UserInteraction
)
from ..repositories.repository_interfaces import (
    InteractionRepositoryInterface, 
    ProductRepositoryInterface
)
from ...shared.constants.model_constants import (
    DEFAULT_RECOMMENDATIONS_COUNT,
    DEFAULT_RELEVANCE_SCORE,
    INTERACTION_WEIGHTS,
    VIEW_DURATION_THRESHOLDS,
    VIEW_DURATION_MULTIPLIERS,
    MAX_SESSION_PRODUCTS_FOR_RECOMMENDATIONS
)
from ...shared.exceptions.exceptions import (
    ModelNotReadyError, 
    UserNotFoundError, 
    ProductNotFoundError
)

logger = logging.getLogger(__name__)


class RecommendationDomainService:
    """Domain service for recommendation business logic."""
    
    def __init__(
        self,
        model: RecommendationModelInterface,
        interaction_repository: InteractionRepositoryInterface,
        product_repository: ProductRepositoryInterface,
    ) -> None:
        """Initialize the domain service."""
        self.model = model
        self.interaction_repository = interaction_repository
        self.product_repository = product_repository
        self.last_refresh: Optional[datetime] = None
    
    async def get_user_recommendations(
        self, 
        user_id: str, 
        count: int = DEFAULT_RECOMMENDATIONS_COUNT
    ) -> List[ProductRecommendation]:
        """
        Get personalized recommendations for a user.
        
        Args:
            user_id: User ID to get recommendations for
            count: Number of recommendations to return
            
        Returns:
            List of product recommendations
            
        Raises:
            ModelNotReadyError: If the model is not ready
            UserNotFoundError: If the user is not found (cold start)
        """
        if not self.model.is_ready():
            logger.warning("Model not ready for predictions")
            raise ModelNotReadyError("Recommendation model is not ready")
        
        try:
            recommendations = await self.model.predict_for_user(user_id, count)
            
            # Enrich with product details
            return await self._enrich_recommendations_with_details(recommendations)
            
        except UserNotFoundError:
            logger.info(f"User {user_id} not found in model, using fallback strategy")
            return await self._get_fallback_recommendations(count)
    
    async def get_session_recommendations(
        self, 
        session_id: str, 
        count: int = DEFAULT_RECOMMENDATIONS_COUNT
    ) -> List[ProductRecommendation]:
        """
        Get recommendations based on session interactions.
        
        Args:
            session_id: Session ID to get recommendations for
            count: Number of recommendations to return
            
        Returns:
            List of product recommendations
        """
        # Get session interactions
        session_interactions = await self.interaction_repository.get_session_interactions(
            session_id
        )
        
        if not session_interactions:
            logger.info(f"No interactions found for session {session_id}")
            return await self._get_fallback_recommendations(count)
        
        # Extract viewed products
        viewed_product_ids = self._extract_product_ids_from_interactions(
            session_interactions
        )
        
        if not viewed_product_ids:
            return await self._get_fallback_recommendations(count)
        
        # Get similar products based on viewed products
        all_similar_products = []
        for product_id in viewed_product_ids[:MAX_SESSION_PRODUCTS_FOR_RECOMMENDATIONS]:
            try:
                similar = await self.model.predict_similar_products(product_id, count=3)
                all_similar_products.extend(similar)
            except ProductNotFoundError:
                logger.warning(f"Product {product_id} not found in model")
                continue
        
        # Deduplicate and filter out already viewed products
        unique_recommendations = self._deduplicate_and_filter_recommendations(
            all_similar_products, 
            exclude_product_ids=set(viewed_product_ids)
        )
        
        # Sort by relevance score and take top N
        sorted_recommendations = sorted(
            unique_recommendations, 
            key=lambda x: x.relevance_score, 
            reverse=True
        )
        
        result = sorted_recommendations[:count]
        return await self._enrich_recommendations_with_details(result)
    
    async def get_similar_products(
        self, 
        product_id: str, 
        count: int = DEFAULT_RECOMMENDATIONS_COUNT
    ) -> List[ProductRecommendation]:
        """
        Get products similar to a given product.
        
        Args:
            product_id: Product ID to find similar products for
            count: Number of similar products to return
            
        Returns:
            List of similar product recommendations
            
        Raises:
            ModelNotReadyError: If the model is not ready
            ProductNotFoundError: If the product is not found
        """
        if not self.model.is_ready():
            logger.warning("Model not ready for predictions")
            raise ModelNotReadyError("Recommendation model is not ready")
        
        similar_products = await self.model.predict_similar_products(product_id, count)
        return await self._enrich_recommendations_with_details(similar_products)
    
    async def refresh_model(self) -> ModelRefreshResult:
        """
        Refresh the recommendation model with latest interaction data.
        
        Returns:
            Result of the model refresh operation
        """
        start_time = datetime.now()
        
        try:
            # Get all interactions for training
            interactions = await self.interaction_repository.get_all_user_product_interactions()
            
            if not interactions:
                logger.warning("No interactions found for training")
                return ModelRefreshResult(
                    success=False,
                    error="No training data available",
                    timestamp=start_time.isoformat()
                )
            
            # Train the model
            await self.model.train(interactions)
            
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            self.last_refresh = end_time
            
            # Calculate stats
            unique_users = len(set(interaction.user_id for interaction in interactions))
            unique_products = len(set(
                pid for interaction in interactions 
                for pid in interaction.product_ids
            ))
            
            logger.info(f"Model refresh completed in {duration:.2f}s")
            
            return ModelRefreshResult(
                success=True,
                duration_seconds=duration,
                timestamp=end_time.isoformat(),
                num_users=unique_users,
                num_products=unique_products
            )
            
        except Exception as e:
            logger.error(f"Error refreshing model: {str(e)}")
            return ModelRefreshResult(
                success=False,
                error=str(e),
                timestamp=datetime.now().isoformat()
            )
    
    async def _get_fallback_recommendations(
        self, 
        count: int
    ) -> List[ProductRecommendation]:
        """
        Get fallback recommendations (most popular products).
        
        Args:
            count: Number of recommendations to return
            
        Returns:
            List of product recommendations
        """
        try:
            most_viewed = await self.interaction_repository.get_most_viewed_products(count)
            
            recommendations = []
            for idx, product_data in enumerate(most_viewed):
                product_id = product_data.get("productId")
                if product_id:
                    recommendation = ProductRecommendation(
                        id=product_id,
                        relevance_score=DEFAULT_RELEVANCE_SCORE,
                        rank=idx + 1,
                        details={"viewCount": product_data.get("count", 0)}
                    )
                    recommendations.append(recommendation)
            
            return await self._enrich_recommendations_with_details(recommendations)
            
        except Exception as e:
            logger.error(f"Error getting fallback recommendations: {str(e)}")
            # Return empty list as last resort
            return []
    
    def _extract_product_ids_from_interactions(
        self, 
        interactions: List[UserInteraction]
    ) -> List[str]:
        """Extract product IDs from a list of interactions."""
        product_ids = []
        for interaction in interactions:
            product_ids.extend(interaction.product_ids)
        return list(dict.fromkeys(product_ids))  # Preserve order and remove duplicates
    
    def _deduplicate_and_filter_recommendations(
        self,
        recommendations: List[ProductRecommendation],
        exclude_product_ids: set[str]
    ) -> List[ProductRecommendation]:
        """Deduplicate recommendations and filter out excluded products."""
        seen_products = set()
        unique_recommendations = []
        
        for recommendation in recommendations:
            if (recommendation.id not in seen_products and 
                recommendation.id not in exclude_product_ids):
                seen_products.add(recommendation.id)
                unique_recommendations.append(recommendation)
        
        return unique_recommendations
    
    async def _enrich_recommendations_with_details(
        self, 
        recommendations: List[ProductRecommendation]
    ) -> List[ProductRecommendation]:
        """
        Enrich recommendations with product details from external service.
        
        Args:
            recommendations: List of basic recommendations
            
        Returns:
            List of recommendations with enriched details
        """
        if not recommendations:
            return recommendations
        
        try:
            product_ids = [rec.id for rec in recommendations]
            product_details = await self.product_repository.get_product_details_batch(
                product_ids
            )
            
            enriched_recommendations = []
            for recommendation in recommendations:
                details = product_details.get(recommendation.id, {})
                enriched_recommendation = ProductRecommendation(
                    id=recommendation.id,
                    relevance_score=recommendation.relevance_score,
                    rank=recommendation.rank,
                    details={**(recommendation.details or {}), **details}
                )
                enriched_recommendations.append(enriched_recommendation)
            
            return enriched_recommendations
            
        except Exception as e:
            logger.error(f"Error enriching recommendations: {str(e)}")
            # Return original recommendations without enrichment
            return recommendations
    
    @staticmethod
    def calculate_interaction_weight(interaction: UserInteraction) -> float:
        """
        Calculate the weight for an interaction based on its type and properties.
        
        Args:
            interaction: User interaction to calculate weight for
            
        Returns:
            Calculated weight for the interaction
        """
        base_weight = INTERACTION_WEIGHTS.get(interaction.interaction_type, 1.0)
        
        # Apply view duration multipliers for product views
        if interaction.interaction_type == "product_view" and interaction.view_duration:
            duration = interaction.view_duration
            if duration > VIEW_DURATION_THRESHOLDS["medium"]:
                base_weight *= VIEW_DURATION_MULTIPLIERS["medium"]
            elif duration > VIEW_DURATION_THRESHOLDS["short"]:
                base_weight *= VIEW_DURATION_MULTIPLIERS["short"]
        
        # Handle specific interaction actions
        if interaction.interaction_type == "interaction":
            action = interaction.data.get("action", "")
            action_weight = INTERACTION_WEIGHTS.get(action, 0.3)
            base_weight = action_weight
        
        return base_weight