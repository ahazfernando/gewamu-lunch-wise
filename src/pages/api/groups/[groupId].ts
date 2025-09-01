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
    const { groupId } = req.query;

    if (req.method === "GET") {
        const group = await (Group as typeof import("mongoose").Model).findById(
            groupId
        );
        if (!group) return res.status(404).json({ error: "Group not found" });
        return res.status(200).json(group);
    } else if (req.method === "PUT") {
        // Update group (e.g., add/remove participants)
        const update = req.body;
        const group = await (
            Group as typeof import("mongoose").Model
        ).findByIdAndUpdate(groupId, update, {
            new: true,
        });
        if (!group) return res.status(404).json({ error: "Group not found" });
        return res.status(200).json(group);
    } else if (req.method === "DELETE") {
        await (Group as typeof import("mongoose").Model).findByIdAndDelete(
            groupId
        );
        return res.status(204).end();
    } else {
        return res.status(405).end();
    }
}
