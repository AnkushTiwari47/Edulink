import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }

}, { timestamps: true });

export default mongoose.model("Connection", connectionSchema);