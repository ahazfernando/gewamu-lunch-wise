import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import type { IUser } from "@/models/User";
import { comparePassword, signJwt } from "@/lib/auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") return res.status(405).end();
    await dbConnect();
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Missing fields" });
    const user = await (User as typeof import("mongoose").Model).findOne({
        email,
    });
    if (!user || !user.isVerified)
        return res
            .status(401)
            .json({ error: "Invalid credentials or not verified" });
    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    const token = signJwt({ userId: user._id.toString(), email: user.email });
    res.status(200).json({
        token,
        user: { name: user.name, email: user.email },
    });
}
