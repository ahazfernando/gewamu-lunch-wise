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
    const user = token ? verifyJwt(token) : null;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { groupId, participant } = req.body;

    if (req.method === "POST") {
        // Add participant
        const group = await (Group as typeof import("mongoose").Model).findById(
            groupId
        );
        if (!group) return res.status(404).json({ error: "Group not found" });
        group.participants.push(participant);
        await group.save();
        return res.status(200).json(group);
    } else if (req.method === "DELETE") {
        // Remove participant
        const group = await (Group as typeof import("mongoose").Model).findById(
            groupId
        );
        if (!group) return res.status(404).json({ error: "Group not found" });
        group.participants = group.participants.filter(
            (p: any) => p.email !== participant.email
        );
        await group.save();
        return res.status(200).json(group);
    } else {
        return res.status(405).end();
    }
}
