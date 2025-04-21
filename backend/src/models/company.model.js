import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const CompanySchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders"
    }],
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "wallets"
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "transactions"
    }],
    pickupAddresses: [{
        type: Object
    }],
    totalSpend: {
        type: Number
    },
    name: {
        type: String,
    },
    businessType: {
        type: String
    },
    mobileNo: {
        type: Number
    },
    address1: {
        type: String
    },
    address2: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    pinCode: {
        type: String
    },
    gstNumber: {
        type: String
    },
    gstCertificate: {
        type: String
    },
    rejected: {
        type: Boolean,
        default: false
    },
    isDocumentVerified: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },

}, { timestamps: true })


CompanySchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

CompanySchema.pre(["updateOne", "findByIdAndUpdate", "findOneAndUpdate"], async function (next) {
    const data = this.getUpdate();
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10)
    }
    next()
})

CompanySchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password)
}

CompanySchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


export const companies = mongoose.model("companies", CompanySchema)