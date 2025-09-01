import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Notification from "@/models/Notification";
import { verifyJwt } from "@/lib/auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect();
    const token = req.headers.authorization?.split(" ")[1];
    const payload = token ? verifyJwt(token) : null;
    const userId =
        typeof payload === "object" && payload && "userId" in payload
            ? (payload as any).userId
            : null;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    if (req.method === "GET") {
        // List notifications for user
        const notifications = await (
            Notification as typeof import("mongoose").Model
        ).find({ user: userId });
        return res.status(200).json(notifications);
    } else {
        return res.status(405).end();
    }
}
