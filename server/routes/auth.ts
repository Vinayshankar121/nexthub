import { RequestHandler } from "express";
import { db } from "../db";

export const register: RequestHandler = async (req, res) => {
    try {
        const { email, password, fullName, role } = req.body;

        if (!email || !password || !fullName || !role) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existingUser = await db.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const user = await db.addUser({ email, password, fullName, role });

        // In a real app, generate a JWT token here
        const token = Buffer.from(JSON.stringify(user)).toString("base64");

        res.status(201).json({ user, token });
    } catch (error: any) {
        console.error("Registration failed:", error);
        res.status(500).json({ error: "Registration failed", details: error.message });
    }
};

export const login: RequestHandler = async (req, res) => {
    try {
        const { email, password, role } = req.body; // Role optional for login, but good for verification if needed

        const user = await db.getUserByEmail(email);

        if (!user || user.password !== password) {
            // Simple password check (in production use bcrypt)
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Role check if provided
        if (role && user.role !== role) {
            return res.status(403).json({ error: "Invalid role for this user" });
        }

        // In a real app, generate a JWT token here
        const token = Buffer.from(JSON.stringify(user)).toString("base64");

        res.json({ user, token });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};
