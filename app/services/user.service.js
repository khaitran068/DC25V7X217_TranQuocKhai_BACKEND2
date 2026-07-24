const { ObjectId } = require("mongodb");

class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }

    // Trích xuất dữ liệu hợp lệ từ body
    extractUserData(payload) {
        const user = {
            name: payload.name,
            email: payload.email,
            password: payload.password, // Lưu ý: thực tế nên mã hóa bằng bcryptjs
        };
        // Xóa các trường undefined
        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user;
    }

    async register(payload) {
        const user = this.extractUserData(payload);
        const result = await this.User.insertOne(user);
        return result;
    }

    async findByEmail(email) {
        return await this.User.findOne({ email });
    }

    async findById(id) {
        return await this.User.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
}

module.exports = UserService;