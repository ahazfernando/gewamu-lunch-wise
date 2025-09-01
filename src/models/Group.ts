import mongoose, { Schema, Document, Types } from "mongoose";

export interface IParticipant {
    user: Types.ObjectId;
    name: string;
    email: string;
    split: number; // percentage or amount
    paid: boolean;
}

export interface IGroup extends Document {
    name: string;
    organizer: Types.ObjectId;
    participants: IParticipant[];
    totalAmount: number;
    splitType: "equal" | "custom";
    createdAt: Date;
}

const ParticipantSchema = new Schema<IParticipant>({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
    email: String,
    split: Number,
    paid: { type: Boolean, default: false },
});

const GroupSchema = new Schema<IGroup>({
    name: { type: String, required: true },
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [ParticipantSchema],
    totalAmount: { type: Number, required: true },
    splitType: { type: String, enum: ["equal", "custom"], default: "equal" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Group ||
    mongoose.model<IGroup>("Group", GroupSchema);
