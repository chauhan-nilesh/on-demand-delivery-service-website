import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companies"
    },
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "partners"
    },
    internalOrderId: {
        type: String
    },
    items: {
        type: Number
    },
    weight: {
        type: String
    },
    amountToCollect: {
        type: Number
    },
    deliveryCharges: {
        type: Number
    },
    paymentMode: {
        type: String
    },
    pickupAddress: {
        text: {
            type: String
        },
        coordinates: {
            type: Object
        }
    },
    deliveryAddress: {
        text: {
            type: String
        },
        coordinates: {
            type: Object
        }
    },
    pinCode: {
        type: String
    },
    customerName: {
        type: String
    },
    customerPhoneNo: {
        type: Number
    },
    orderStatus: {
        type: String,
        default: "Waiting"
    },
    isOrderAllotted: {
        type: Boolean
    },
    deliveryDateTime: {
        type: Date
    }
}, { timestamps: true })

export const orders = mongoose.model("orders", OrderSchema)