import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
    registerCustomer,
    loginCustomer,
} from "../services/customerAuthService.js";

export const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters",
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const result = await registerCustomer(
            name,
            email,
            hashedPassword,
            phone || null
        );

        if (!result.success) {
            return res.status(409).json({
                success: false,
                message: result.message,
            });
        }

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            userId: result.user_id,
        });
    } catch (error) {
        console.error(
            "Customer registration error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const login = async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required",
            });
        }

        const user = await loginCustomer(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                message:
                    "Your account is inactive",
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: "customer",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                city: user.city,
                state: user.state,
                pincode: user.pincode,
            },
        });
    } catch (error) {
        console.error(
            "Customer login error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};