const userService = require("../services/userService");


// Get All Users

const getAllUsers = async (req, res) => {

    try {

        const users =
            await userService.getAllUsers();

        return res.status(200).json({

            success: true,

            users

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch users",

            error: error.message

        });

    }
};

// Get User By ID
const getUserById = async (req, res) => {

    try {

        const { id } = req.params;

        const user =
            await userService.getUserById(id);


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        return res.status(200).json({

            success: true,

            user

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch user",

            error: error.message

        });

    }
};

// Update User Status

const updateUserStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;


        if (
            !status ||
            !["active", "inactive"].includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Status must be active or inactive"

            });

        }


        const user =
            await userService.updateUserStatus(
                id,
                status
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "User status updated successfully",

            user

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                "Failed to update user status",

            error: error.message

        });

    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, phone, address, city, state, pincode, status } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email and password are required" });
        }
        
        const bcrypt = require("bcryptjs");
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await userService.createUser(
            name, email, hashedPassword, phone, address, city, state, pincode, status || 'active'
        );
        
        return res.status(201).json({ success: true, message: "User created successfully", user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to create user", error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, city, state, pincode, status } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ success: false, message: "Name and email are required" });
        }
        
        const user = await userService.updateUser(
            id, name, email, phone, address, city, state, pincode, status || 'active'
        );
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        return res.status(200).json({ success: true, message: "User updated successfully", user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to update user", error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserStatus,
    createUser,
    updateUser
};