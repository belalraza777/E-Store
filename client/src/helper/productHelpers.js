// productHelpers.js - helper functions for admin product page

// Filter products by category
export function filterByCategory(products, currentCategory) {
  if (currentCategory === 'all') return products;
  return products.filter(
    (product) => product?.category === currentCategory
  );
}

// Filter products by search term
export function filterBySearch(products, searchTerm) {
  if (!searchTerm.trim()) return products;
  const term = searchTerm.trim().toLowerCase();
  return products.filter((p) =>
    (p.title && p.title.toLowerCase().includes(term)) ||
    (p.slug && p.slug.toLowerCase().includes(term)) ||
    (p._id && p._id.toLowerCase().includes(term))
  );
}
