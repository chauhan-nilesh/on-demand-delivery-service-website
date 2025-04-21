import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const AdminSchema = new mongoose.Schema({
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
    cities: [{
        type: Object
    }],
    zones: [{
        type: Object
    }],
    deliveryRates: {
        type: Array,
        default: [
            { weightRange: "Less than 1kg", charge: 0 },
            { weightRange: "1-3kg", charge: 0 },
            { weightRange: "3-5kg", charge: 0 },
            { weightRange: "More than 5kg", charge: 0 },
        ]
    },
    income: {
        type: Number
    }
}, { timestamps: true })


AdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

AdminSchema.pre(["updateOne", "findByIdAndUpdate", "findOneAndUpdate"], async function (next) {
    const data = this.getUpdate();
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10)
    }
    next()
})

AdminSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password)
}

AdminSchema.methods.generateAccessToken = function () {
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


export const admins = mongoose.model("admins", AdminSchema)