import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Group from "@/models/Group";
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

    if (req.method === "POST") {
        // Create group
        const { name, participants, totalAmount, splitType } = req.body;
        if (!name || !participants || !totalAmount || !splitType)
            return res.status(400).json({ error: "Missing fields" });
        const group = await (Group as typeof import("mongoose").Model).create({
            name,
            organizer: userId,
            participants,
            totalAmount,
            splitType,
        });
        return res.status(201).json(group);
    } else if (req.method === "GET") {
        // List groups for user
        const groups = await (Group as typeof import("mongoose").Model).find({
            organizer: userId,
        });
        return res.status(200).json(groups);
    } else {
        return res.status(405).end();
    }
}
