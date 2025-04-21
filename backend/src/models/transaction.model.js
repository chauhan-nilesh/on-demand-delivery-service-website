import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companies"
    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "wallets"
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders"
    },
    type: {
        type: String,
        enum: ["Credit", "Debit"]
    },
    upiId: {
        type: String
    },
    amount: {
        type: Number
    },
    status: {
        type: String,
        enum: ["success", 'fail']
    }
}, { timestamps: true })

export const transactions = mongoose.model("transactions", TransactionSchema)