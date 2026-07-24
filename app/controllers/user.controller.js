const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Đăng ký tài khoản
exports.register = async (req, res, next) => {
    if (!req.body?.email || !req.body?.password) {
        return next(new ApiError(400, "Email và mật khẩu không được để trống"));
    }

    try {
        const userService = new UserService(MongoDB.client);
        
        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await userService.findByEmail(req.body.email);
        if (existingUser) {
            return next(new ApiError(400, "Email này đã được sử dụng"));
        }

        // Mã hóa mật khẩu trước khi lưu
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        await userService.register({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        return res.send({ message: "Đăng ký tài khoản thành công!" });
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi trong quá trình đăng ký")
        );
    }
};

// Đăng nhập
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ApiError(400, "Vui lòng nhập đầy đủ email và mật khẩu"));
    }

    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.findByEmail(email);

        if (!user) {
            return next(new ApiError(401, "Email hoặc mật khẩu không chính xác"));
        }

        // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(new ApiError(401, "Email hoặc mật khẩu không chính xác"));
        }

        // Tạo JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || "secret_key",
            { expiresIn: "24h" }
        );

        return res.send({
            message: "Đăng nhập thành công!",
            accessToken: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi trong quá trình đăng nhập")
        );
    }
};