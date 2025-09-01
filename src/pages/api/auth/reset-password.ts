import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { sendMail } from "@/lib/email";
import crypto from "crypto";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect();
    if (req.method === "POST") {
        // Request password reset
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Missing email" });
        const user = await (User as typeof import("mongoose").Model).findOne({
            email,
        });
        if (!user) return res.status(404).json({ error: "User not found" });
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
        await user.save();
        const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
        await sendMail({
            to: email,
            subject: "Reset your password",
            html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
        });
        return res.status(200).json({ message: "Reset email sent" });
    } else if (req.method === "PUT") {
        // Perform password reset
        const { token, password } = req.body;
        if (!token || !password)
            return res.status(400).json({ error: "Missing fields" });
        const user = await (User as typeof import("mongoose").Model).findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() },
        });
        if (!user)
            return res.status(400).json({ error: "Invalid or expired token" });
        user.password = await hashPassword(password);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        return res.status(200).json({ message: "Password reset successful" });
    } else {
        return res.status(405).end();
    }
}
