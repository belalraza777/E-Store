import Product from "../models/productModel.js";


export const processProductSlug = async (title) => {
    if (!title) return { valid: false, slug: null, error: "Title required" };

    let slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

    if (!slug) return { valid: false, slug: null, error: "Invalid title" };

    // Check for uniqueness and add suffix if needed
    let finalSlug = slug;
    let counter = 1;
    
    while (true) {
        const query = { slug: finalSlug };

        const exists = await Product.findOne(query);
        if (!exists) break;
        
        finalSlug = `${slug}-${counter}`;
        counter++;
    }
    
    return { valid: true, slug: finalSlug, error: null };
};
