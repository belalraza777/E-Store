// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    const isProd = process.env.NODE_ENV === 'production';

    console.error(`\n[Error] ${req.method} ${req.originalUrl}`);
    if (err.stack) console.error(err.stack);

    const payload = {
        success: false,
        message,
        error: message,
        ...(isProd ? {} : { stack: err.stack })
    };

    return res.status(status).json(payload);
};

export default errorHandler;
