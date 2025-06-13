const { Role } = require("../models");
const CrudRepository = require("./curd-repository");

class RoleRepository extends CrudRepository {
    constructor() {
        super(Role)
    }

    async getByRole(name) {
        const role = await Role.findOne({
            where: { name: name }
        });
        return role;
    }

}

module.exports = RoleRepository;