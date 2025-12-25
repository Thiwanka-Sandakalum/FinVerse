import * as api from './api';

// Product-related types
export type Product = api.components['schemas']['Product'];
export type Institution = api.components['schemas']['Institution'];
export type ProductCategory = api.components['schemas']['ProductCategory'];
export type InstitutionType = api.components['schemas']['InstitutionType'];
export type FieldDefinition = api.components['schemas']['FieldDefinition'];
export type ErrorResponse = api.components['schemas']['Error'];
export type MessageResponse = api.components['schemas']['MessageResponse'];
export type PaginatedResponse = api.components['schemas']['PaginatedResponse'];

// /products
export type ProductListRequest = api.paths['/products']['get']['parameters']['query'];
export type ProductListResponse =
    api.paths['/products']['get']['responses']['200']['content']['application/json'] |
    api.paths['/products']['get']['responses']['400']['content']['application/json'];
export type ProductCreateRequest = api.paths['/products']['post']['requestBody']['content']['application/json'];
export type ProductCreateResponse =
    api.paths['/products']['post']['responses']['201']['content']['application/json'] |
    api.paths['/products']['post']['responses']['400']['content']['application/json'] |
    api.paths['/products']['post']['responses']['401']['content']['application/json'] |
    api.paths['/products']['post']['responses']['403']['content']['application/json'];

// /products/{id}
export type ProductDetailRequest = api.paths['/products/{id}']['parameters']['path'];
export type ProductDetailResponse =
    api.paths['/products/{id}']['get']['responses']['200']['content']['application/json'] |
    api.paths['/products/{id}']['get']['responses']['404']['content']['application/json'];
export type ProductUpdateRequest = api.paths['/products/{id}']['put']['requestBody']['content']['application/json']
export type ProductUpdateResponse =
    api.paths['/products/{id}']['put']['responses']['200']['content']['application/json'] |
    api.paths['/products/{id}']['put']['responses']['400']['content']['application/json'] |
    api.paths['/products/{id}']['put']['responses']['401']['content']['application/json'] |
    api.paths['/products/{id}']['put']['responses']['403']['content']['application/json'] |
    api.paths['/products/{id}']['put']['responses']['404']['content']['application/json'];
export type ProductDeleteRequest = api.paths['/products/{id}']['parameters']['path'];
export type ProductDeleteResponse =
    api.paths['/products/{id}']['delete']['responses']['200']['content']['application/json'] |
    api.paths['/products/{id}']['delete']['responses']['401']['content']['application/json'] |
    api.paths['/products/{id}']['delete']['responses']['403']['content']['application/json'] |
    api.paths['/products/{id}']['delete']['responses']['404']['content']['application/json'];

// /products/categories
export type ProductCategoryListRequest = api.paths['/products/categories']['get']['parameters']['query'];
export type ProductCategoryListResponse =
    api.paths['/products/categories']['get']['responses']['200']['content']['application/json'];
export type ProductCategoryCreateRequest = api.paths['/products/categories']['post']['requestBody']['content']['application/json']
export type ProductCategoryCreateResponse =
    api.paths['/products/categories']['post']['responses']['201']['content']['application/json'] |
    api.paths['/products/categories']['post']['responses']['400']['content']['application/json'] |
    api.paths['/products/categories']['post']['responses']['401']['content']['application/json'] |
    api.paths['/products/categories']['post']['responses']['403']['content']['application/json'];

// /products/categories/{id}
export type ProductCategoryDetailRequest = api.paths['/products/categories/{id}']['parameters']['path'];
export type ProductCategoryDetailResponse =
    api.paths['/products/categories/{id}']['get']['responses']['200']['content']['application/json'] |
    api.paths['/products/categories/{id}']['get']['responses']['404']['content']['application/json'];
export type ProductCategoryUpdateRequest = api.paths['/products/categories/{id}']['put']['requestBody'];
export type ProductCategoryUpdateResponse =
    api.paths['/products/categories/{id}']['put']['responses']['200']['content']['application/json'] |
    api.paths['/products/categories/{id}']['put']['responses']['400']['content']['application/json'] |
    api.paths['/products/categories/{id}']['put']['responses']['401']['content']['application/json'] |
    api.paths['/products/categories/{id}']['put']['responses']['403']['content']['application/json'] |
    api.paths['/products/categories/{id}']['put']['responses']['404']['content']['application/json'];
export type ProductCategoryDeleteRequest = api.paths['/products/categories/{id}']['parameters']['path'];
export type ProductCategoryDeleteResponse =
    api.paths['/products/categories/{id}']['delete']['responses']['200']['content']['application/json'] |
    api.paths['/products/categories/{id}']['delete']['responses']['401']['content']['application/json'] |
    api.paths['/products/categories/{id}']['delete']['responses']['403']['content']['application/json'] |
    api.paths['/products/categories/{id}']['delete']['responses']['404']['content']['application/json'];

// /products/categories/hierarchy
export type ProductCategoryHierarchyResponse =
    api.paths['/products/categories/hierarchy']['get']['responses']['200']['content']['application/json'];

// /products/categories/{categoryId}/fields
export type ProductCategoryFieldsRequest = api.paths['/products/categories/{categoryId}/fields']['parameters']['path'];
export type ProductCategoryFieldsListResponse =
    api.paths['/products/categories/{categoryId}/fields']['get']['responses']['200']['content']['application/json'];
export type ProductCategoryFieldCreateRequest = api.paths['/products/categories/{categoryId}/fields']['post']['requestBody']['content']['application/json']
export type ProductCategoryFieldCreateResponse =
    api.paths['/products/categories/{categoryId}/fields']['post']['responses']['201']['content']['application/json'] |
    api.paths['/products/categories/{categoryId}/fields']['post']['responses']['400']['content']['application/json'] |
    api.paths['/products/categories/{categoryId}/fields']['post']['responses']['401']['content']['application/json'] |
    api.paths['/products/categories/{categoryId}/fields']['post']['responses']['403']['content']['application/json'] |
    api.paths['/products/categories/{categoryId}/fields']['post']['responses']['404']['content']['application/json'];

// /products/categories/{categoryId}/fields/{fieldId}
export type ProductCategoryFieldDetailRequest = api.paths['/products/categories/{categoryId}/fields/{fieldId}']['parameters']['path'];
export type ProductCategoryFieldDetailResponse =
    api.paths['/products/categories/{categoryId}/fields/{fieldId}']['get']['responses']['200']['content']['application/json'] |
    api.paths['/products/categories/{categoryId}/fields/{fieldId}']['get']['responses']['404']['content']['application/json'];
export type ProductCategoryFieldUpdateRequest = api.paths['/products/categories/{categoryId}/fields/{fieldId}']['put']['requestBody']['content']['application/json']
export type ProductCategoryFieldUpdateResponse =
    api.paths['/products/categories/{categoryId}/fields/{fieldId}']['put']['responses']['200']['content']['application/json'] |
    api.paths['/products/categories/{categoryId}/fields/{fieldId}']['put']['responses']['400']['content']['application/json'] |
    api.paths['/products/categories/{categoryId}/fields/{fieldId}']['put']['responses']['401']['content']['application/json'] |
    api.paths['/products/categories/{categoryId}/fields/{fieldId}']['put']['responses']['403']['content']['application/json'] |
    api.paths['/products/categories/{categoryId}/fields/{fieldId}']['put']['responses']['404']['content']['application/json'];
export type ProductCategoryFieldDeleteRequest = api.paths['/products/categories/{categoryId}/fields/{fieldId}']['parameters']['path'];
export type ProductCategoryFieldDeleteResponse =
    api.paths['/products/categories/{categoryId}/fields/{fieldId}']['delete']['responses']['200']['content']['application/json'] |
    api.paths['/products/categories/{categoryId}/fields/{fieldId}']['delete']['responses']['401']['content']['application/json'] |
    api.paths['/products/categories/{categoryId}/fields/{fieldId}']['delete']['responses']['403']['content']['application/json'] |
    api.paths['/products/categories/{categoryId}/fields/{fieldId}']['delete']['responses']['404']['content']['application/json'];

// /institutions
export type InstitutionListRequest = api.paths['/institutions']['get']['parameters']['query'];
export type InstitutionListResponse =
    api.paths['/institutions']['get']['responses']['200']['content']['application/json'] |
    api.paths['/institutions']['get']['responses']['400']['content']['application/json'];
export type InstitutionCreateRequest = api.paths['/institutions']['post']['requestBody']['content']['application/json']
export type InstitutionCreateResponse =
    api.paths['/institutions']['post']['responses']['201']['content']['application/json'] |
    api.paths['/institutions']['post']['responses']['400']['content']['application/json'] |
    api.paths['/institutions']['post']['responses']['401']['content']['application/json'] |
    api.paths['/institutions']['post']['responses']['403']['content']['application/json'];

// /institutions/{id}
export type InstitutionDetailRequest = api.paths['/institutions/{id}']['parameters']['path'];
export type InstitutionDetailResponse =
    api.paths['/institutions/{id}']['get']['responses']['200']['content']['application/json'] |
    api.paths['/institutions/{id}']['get']['responses']['404']['content']['application/json'];
export type InstitutionUpdateRequest = api.paths['/institutions/{id}']['put']['requestBody']['content']['application/json']
export type InstitutionUpdateResponse =
    api.paths['/institutions/{id}']['put']['responses']['200']['content']['application/json'] |
    api.paths['/institutions/{id}']['put']['responses']['400']['content']['application/json'] |
    api.paths['/institutions/{id}']['put']['responses']['401']['content']['application/json'] |
    api.paths['/institutions/{id}']['put']['responses']['403']['content']['application/json'] |
    api.paths['/institutions/{id}']['put']['responses']['404']['content']['application/json'];
export type InstitutionDeleteRequest = api.paths['/institutions/{id}']['parameters']['path'];
export type InstitutionDeleteResponse =
    api.paths['/institutions/{id}']['delete']['responses']['200']['content']['application/json'] |
    api.paths['/institutions/{id}']['delete']['responses']['401']['content']['application/json'] |
    api.paths['/institutions/{id}']['delete']['responses']['403']['content']['application/json'] |
    api.paths['/institutions/{id}']['delete']['responses']['404']['content']['application/json'];

// /institutions/types
export type InstitutionTypeListResponse =
    api.paths['/institutions/types']['get']['responses']['200']['content']['application/json'];
export type InstitutionTypeCreateRequest = api.paths['/institutions/types']['post']['requestBody']['content']['application/json']
export type InstitutionTypeCreateResponse =
    api.paths['/institutions/types']['post']['responses']['201']['content']['application/json'] |
    api.paths['/institutions/types']['post']['responses']['400']['content']['application/json'] |
    api.paths['/institutions/types']['post']['responses']['401']['content']['application/json'] |
    api.paths['/institutions/types']['post']['responses']['403']['content']['application/json'];

// /institutions/types/{id}
export type InstitutionTypeDetailRequest = api.paths['/institutions/types/{id}']['parameters']['path'];
export type InstitutionTypeDetailResponse =
    api.paths['/institutions/types/{id}']['get']['responses']['200']['content']['application/json'] |
    api.paths['/institutions/types/{id}']['get']['responses']['404']['content']['application/json'];
export type InstitutionTypeUpdateRequest = api.paths['/institutions/types/{id}']['put']['requestBody']['content']['application/json']
export type InstitutionTypeUpdateResponse =
    api.paths['/institutions/types/{id}']['put']['responses']['200']['content']['application/json'] |
    api.paths['/institutions/types/{id}']['put']['responses']['400']['content']['application/json'] |
    api.paths['/institutions/types/{id}']['put']['responses']['401']['content']['application/json'] |
    api.paths['/institutions/types/{id}']['put']['responses']['403']['content']['application/json'] |
    api.paths['/institutions/types/{id}']['put']['responses']['404']['content']['application/json'];
export type InstitutionTypeDeleteRequest = api.paths['/institutions/types/{id}']['parameters']['path'];
export type InstitutionTypeDeleteResponse =
    api.paths['/institutions/types/{id}']['delete']['responses']['200']['content']['application/json'] |
    api.paths['/institutions/types/{id}']['delete']['responses']['401']['content']['application/json'] |
    api.paths['/institutions/types/{id}']['delete']['responses']['403']['content']['application/json'] |
    api.paths['/institutions/types/{id}']['delete']['responses']['404']['content']['application/json'];

// Export all for advanced usage
export * as api from './api';
