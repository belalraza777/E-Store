export const CATEGORIES = [
    "electronics",
    "clothing",
    "books",
    "groceries",
    "sports",
    "beauty",
    "toys",
    "furniture",
    "automotive",
    "jewelry",
    "health",
];

export const isValidCategory = (category) => {
    if (!category) return false;
    return CATEGORIES.includes(category.toLowerCase().trim());
};

export const normalizeCategory = (category) => {
    return category.toLowerCase().trim();
};
