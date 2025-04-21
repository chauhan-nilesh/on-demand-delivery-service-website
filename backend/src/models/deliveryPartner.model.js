import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const DeliveryPartnerSchema = new mongoose.Schema({
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
    payouts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "partnerPayouts"
    }],
    earning: {
        type: Number,
        default: 0
    },
    fullName: {
        type: String,
    },
    mobileNo: {
        type: Number
    },
    jobType: {
        type: String
    },
    address: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    area: {
        type: String
    },
    documentType: {
        type: String
    },
    documentFile: {
        type: String
    },
    drivingLicense: {
        type: String
    },
    personalPhoto: {
        type: String
    },
    paymentDetails: {
        type: {
            type: String,
            enum: ['bankTransfer', 'upi']
        },
        bankName: {
            type: String,
        },
        ifsc: {
            type: String,
        },
        accountNo: {
            type: String,
        },
        accountHolderName: {
            type: String,
        },
        upiId: {
            type: String
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    location: {
        lat: {
            type: Number
        },
        lng: {
            type: Number
        }
    },
    rejected: {
        type: Boolean,
        default: false
    },
    rejectionNote: {
        type: String
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


DeliveryPartnerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

DeliveryPartnerSchema.pre(["updateOne", "findByIdAndUpdate", "findOneAndUpdate"], async function (next) {
    const data = this.getUpdate();
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10)
    }
    next()
})

DeliveryPartnerSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password)
}

DeliveryPartnerSchema.methods.generateAccessToken = function () {
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


export const partners = mongoose.model("partners", DeliveryPartnerSchema)