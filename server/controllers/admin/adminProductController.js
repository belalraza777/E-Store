import * as adminProductService from "../../services/adminProductService.js";

// Create new product (Admin only)
const createProduct = async (req, res) => {
    const result = await adminProductService.createProductLogic(req.body, req.files);

    if (!result.success) {
        return res.status(result.statusCode).json({
            success: false,
            message: result.message,
        });
    }

    return res.status(201).json({
        success: true,
        message: result.message,
        data: result.data,
    });
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
    const result = await adminProductService.updateProductLogic(
        req.params.id,
        req.body,
        req.files
    );

    if (!result.success) {
        return res.status(result.statusCode).json({
            success: false,
            message: result.message,
        });
    }

    return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
    });
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
    const result = await adminProductService.deleteProductLogic(req.params.id);

    if (!result.success) {
        return res.status(result.statusCode).json({
            success: false,
            message: result.message,
        });
    }

    return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
    });
};

// Update product stock (ADMIN only)
const updateStock = async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;

    const result = await adminProductService.updateStockLogic(id, stock);

    if (!result.success) {
        return res.status(result.statusCode).json({
            success: false,
            message: result.message,
        });
    }

    return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
    });
};

export default {
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
};