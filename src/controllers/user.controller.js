const User = require("../models/user.model.js");

class UserController {
    #_userModel;
    constructor() { 
        this.#_userModel = User
    }

    async getAllUsers(req, res) {
        try {
            const allUsers = await User.find()
            res.send({
                message: "Successfully retrieved all users",
                data: allUsers
            });
        } catch (error) {
            res.status(500).send({
                message: "Failed to retrieve users",
                error: error.message
            });
        }
    }

    async createUser(req, res) {
        try {
            const { firstName, lastName, phone, interests } = req.body;
            console.log(firstName, lastName, phone, interests);

            const newUser = new User({
                first_name: firstName,
                last_name: lastName,
                phone,
                interests,
            });

            await newUser.save();

            res.status(201).send({
                message: "Successfully created user",
                data: newUser
            });
        } catch (error) {
            res.status(500).send({
                message: "Failed to create user",
                error: error.message
            });
        }
    }


    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const deletedUser = await User.findByIdAndDelete(userId);

            if (!deletedUser) {
                return res.status(404).send({
                    message: "User not found"
                });
            }

            res.send({
                message: "Successfully deleted user",
                data: deletedUser
            });
        } catch (error) {
            res.status(500).send({
                message: "Failed to delete user",
                error: error.message
            });
        }
    }
}

module.exports = new UserController();