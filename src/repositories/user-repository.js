const { User } = require("../models");
const CrudRepository = require("./curd-repository");

class UserRepository extends CrudRepository {
    constructor() {
        super(User)
    }

    async getUserByEmail(email) {
        const user = await User.findOne({ email: email });
        return user;
    }
}

module.exports = UserRepository;