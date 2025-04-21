import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companies"
    },
    avlBalance: {
        type: Number,
        default: 100
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "transactions"
    }],
    totalSpend: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

export const wallets = mongoose.model("wallets", WalletSchema)