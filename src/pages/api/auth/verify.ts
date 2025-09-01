import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") return res.status(405).end();
    await dbConnect();
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "Missing token" });
    const user = await (User as typeof import("mongoose").Model).findOne({
        resetToken: token,
    });
    if (!user) return res.status(400).json({ error: "Invalid token" });
    user.isVerified = true;
    user.resetToken = undefined;
    await user.save();
    res.status(200).json({ message: "Email verified. You can now log in." });
}
