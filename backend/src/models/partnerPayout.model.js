import mongoose from "mongoose";

const PartnerPayoutSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admins"
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "partners"
    },
    paymentWeekStart: {
        type: Date,
        required: true
    },
    paymentWeekEnd: {
        type: Date,
        required: true
    },
    week: {
        type: String
    },
    paymentMethod: {
        type: String,
    },
    paymentTransactionNo: {
        type: String
    },
    amount: {
        type: Number
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    }
}, { timestamps: true })

export const partnerPayouts = mongoose.model("partnerPayouts", PartnerPayoutSchema)