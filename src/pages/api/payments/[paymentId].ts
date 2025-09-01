import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import { verifyJwt } from "@/lib/auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect();
    const token = req.headers.authorization?.split(" ")[1];
    const user = token ? verifyJwt(token) : null;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { paymentId } = req.query;

    if (req.method === "PUT") {
        // Confirm or dispute payment
        const { status, note } = req.body;
        const payment = await (
            Payment as typeof import("mongoose").Model
        ).findById(paymentId);
        if (!payment)
            return res.status(404).json({ error: "Payment not found" });
        if (status === "confirmed") {
            payment.status = "confirmed";
            payment.confirmedAt = new Date();
        } else if (status === "disputed") {
            payment.status = "disputed";
            payment.disputedAt = new Date();
        }
        payment.history.push({ status, date: new Date(), note });
        await payment.save();
        return res.status(200).json(payment);
    } else {
        return res.status(405).end();
    }
}
