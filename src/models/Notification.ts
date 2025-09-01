import mongoose, { Schema, Document, Types } from "mongoose";

export interface INotification extends Document {
    user: Types.ObjectId;
    type: "payment_request" | "reminder" | "confirmation";
    message: string;
    sentAt: Date;
    group?: Types.ObjectId;
    payment?: Types.ObjectId;
}

const NotificationSchema = new Schema<INotification>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
        type: String,
        enum: ["payment_request", "reminder", "confirmation"],
        required: true,
    },
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    payment: { type: Schema.Types.ObjectId, ref: "Payment" },
});

export default mongoose.models.Notification ||
    mongoose.model<INotification>("Notification", NotificationSchema);
