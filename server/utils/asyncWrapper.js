export default function asyncWrapper(fn) {
    if (typeof fn !== "function") {
        throw new TypeError("asyncWrapper expects a function");
    }

    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}