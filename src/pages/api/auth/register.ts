import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
// Ensure that "@/models/User" exports a Mongoose model, not a type or union.
import { hashPassword } from "@/lib/auth";
import { sendMail } from "@/lib/email";
import crypto from "crypto";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") return res.status(405).end();
    await dbConnect();
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ error: "Missing fields" });
    const existing = await (User as typeof import("mongoose").Model).findOne({
        email,
    });
    if (existing)
        return res.status(409).json({ error: "Email already registered" });
    const hashed = await hashPassword(password);
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const user = await (User as typeof import("mongoose").Model).create({
        name,
        email,
        password: hashed,
        isVerified: false,
        resetToken: verifyToken,
    });
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${verifyToken}`;
    await sendMail({
        to: email,
        subject: "Verify your email",
        html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`,
    });
    res.status(201).json({ message: "Registered. Please verify your email." });
}
