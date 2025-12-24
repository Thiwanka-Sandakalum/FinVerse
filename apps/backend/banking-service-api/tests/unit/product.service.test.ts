import { getAllProducts } from '../../src/services/product.service';

jest.mock('../../src/config/database', () => ({
  product: {
    count: jest.fn().mockResolvedValue(2),
    findMany: jest.fn().mockResolvedValue([
      { id: '1', name: 'A', categoryId: 'cat1', institutionId: 'inst1', isActive: true, isFeatured: false, createdAt: '', updatedAt: '', category: {} },
      { id: '2', name: 'B', categoryId: 'cat2', institutionId: 'inst2', isActive: true, isFeatured: true, createdAt: '', updatedAt: '', category: {} }
    ])
  }
}));

jest.mock('../../src/utils/product-helpers', () => ({
  getSavedProductIds: jest.fn().mockResolvedValue(['1'])
}));

describe('ProductService - getAllProducts', () => {
  it('returns products with meta and isSaved', async () => {
    const result = await getAllProducts({}, 'user1');
    expect(result.products.length).toBe(2);
    expect(result.products[0].isSaved).toBe(true);
    expect(result.products[1].isSaved).toBe(false);
    expect(result.meta.total).toBe(2);
  });
});
