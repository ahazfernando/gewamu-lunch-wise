import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // For JWT, logout is handled client-side by deleting the token
    res.status(200).json({ message: "Logged out" });
}
