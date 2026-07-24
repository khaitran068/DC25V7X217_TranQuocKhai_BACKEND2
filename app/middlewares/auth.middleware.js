const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");

module.exports = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Dạng: Bearer <TOKEN>

    if (!token) {
        return next(new ApiError(401, "Truy cập bị từ chối. Vui lòng đăng nhập!"));
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
        req.user = verified;
        next();
    } catch (error) {
        return next(new ApiError(403, "Token không hợp lệ hoặc đã hết hạn!"));
    }
};