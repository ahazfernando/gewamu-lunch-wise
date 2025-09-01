import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPayment extends Document {
    group: Types.ObjectId;
    participant: Types.ObjectId;
    amount: number;
    status: "pending" | "submitted" | "confirmed" | "disputed";
    submittedAt?: Date;
    confirmedAt?: Date;
    disputedAt?: Date;
    history: Array<{
        status: string;
        date: Date;
        note?: string;
    }>;
}

const PaymentSchema = new Schema<IPayment>({
    group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    participant: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "submitted", "confirmed", "disputed"],
        default: "pending",
    },
    submittedAt: Date,
    confirmedAt: Date,
    disputedAt: Date,
    history: [
        {
            status: String,
            date: Date,
            note: String,
        },
    ],
});

export default mongoose.models.Payment ||
    mongoose.model<IPayment>("Payment", PaymentSchema);
