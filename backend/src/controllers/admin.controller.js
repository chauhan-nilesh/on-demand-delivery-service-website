import { admins } from '../models/admin.model.js'
import { partners } from "../models/deliveryPartner.model.js"
import { companies } from "../models/company.model.js"
import { orders } from "../models/order.model.js";
import { wallets } from "../models/wallet.model.js";
import nodeMailer from "nodemailer"
import jwt from "jsonwebtoken";
import { io } from '../../index.js';

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === "" || password === "") {
            return res.status(400)
                .json(
                    {
                        statusCode: 400,
                        message: "All fields are required"
                    }
                )
        }

        const emailId = email.trim()
        const userExist = await admins.findOne({ email: emailId })

        if (!userExist) {
            return res.status(400).json({
                statusCode: 400,
                message: "Email is not registered"
            })
        }

        const result = await userExist.isPasswordCorrect(password)

        if (!result) {
            return res.status(400).json({
                statusCode: 400,
                message: "Password is incorrect"
            })
        }

        const token = await userExist.generateAccessToken()

        const user = await admins.findOne({ email: emailId })

        return res.status(200).json({
            statusCode: 200,
            data: user,
            token: token,
            message: "Admin Logged In Successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

const adminRegister = async (req, res) => {
    try {
        const { email, password } = req.body;

        const emailExist = await admins.findOne({ email })

        if (emailExist) {
            return res.status(400).json({
                statusCode: 400,
                message: "Email already registered"
            })
        }

        const admin = await admins.create({
            email,
            password
        })

        if (!admin) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Admin registered successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

const getCurrentAdmin = async (req, res) => {

    const admin = await admins.findById(req.user._id).select("-password")

    return res.status(200)
        .json({
            statusCode: 200,
            data: admin,
            message: "current user fetched successfully"
        })
}

const getDataNumbers = async (req, res) => {
    try {
        const countPartners = await partners.countDocuments({})

        const countCompanies = await companies.countDocuments({})

        const countOrders = await orders.countDocuments({})

        const admin = await admins.findById(req.user._id)

        const countOperatingCities = admin.cities.length

        return res.status(200).json({
            data: { countPartners, countCompanies, countOrders, countOperatingCities },
            message: "Data fetched"
        })
    } catch (error) {
        console.log(error)
    }
}

const getAllPartners = async (req, res) => {
    try {
        const partner = await partners.find()

        if (!partner) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: partner.reverse(),
            message: "Data fetched"
        })
    } catch (error) {
        console.log(error)
    }
}

const getAllCompanies = async (req, res) => {
    try {
        const company = await companies.find()

        if (!company) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: company.reverse(),
            message: "Data fetched"
        })
    } catch (error) {
        console.log(error)
    }
}

const getAllOrders = async (req, res) => {
    try {
        const order = await orders.find()

        if (!order) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: order.reverse(),
            message: "Data fetched"
        })
    } catch (error) {
        console.log(error)
    }
}

const adminUpdatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const admin = await admins.findById(req.user._id)

        const result = await admin.isPasswordCorrect(oldPassword)

        if (!result) {
            return res.status(400).json({
                statusCode: 400,
                message: "Old password is incorrect"
            })
        }

        const updatePassword = await admins.findByIdAndUpdate(req.user._id, {
            password: newPassword
        })

        if (!updatePassword) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Password updated!"
        })
    } catch (error) {
        console.log(error)
    }
}

const addDeliveryCity = async (req, res) => {
    try {
        const { state, city, adminId } = req.body;

        const admin = await admins.findById(adminId)

        admin.cities.push({ state, city })
        await admin.save()

        return res.status(200).json({
            statusCode: 200,
            message: "City Added Successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

const addDeliveryZone = async (req, res) => {
    try {
        const { zoneName, city, pinCodes, adminId } = req.body;

        const admin = await admins.findById(adminId)

        admin.zones.push({ zoneName, city, pinCodes })
        await admin.save()

        return res.status(200).json({
            statusCode: 200,
            message: "Zone Created Successfully!"
        })
    } catch (error) {
        console.log(error)
    }
}

const setDeliveryRates = async (req, res) => {
    try {
        const { charges, adminId } = req.body;

        const added = await admins.findByIdAndUpdate(adminId, {
            deliveryRates: charges
        })

        if (!added) {
            return res.status(400).json({
                statusCode: 400,
                message: "Sonething wnet wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Dleivery rates updated"
        })
    } catch (error) {
        console.log(error)
    }
}

const getPartnerDetails = async (req, res) => {
    try {
        const { partnerId } = req.params;
        
        const data = await partners.findById(partnerId);

        if (!data) {
            return res.status(400).json({
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            data
        })
    } catch (error) {
        console.log(error)
    }
}

const updatePartnerStatus = async (req, res) => {
    try {
        const { partnerId } = req.params;
        const statusData = req.body;
        console.log(statusData)
        const updated = await partners.findByIdAndUpdate(partnerId, {
            ...statusData
        })

        if(!updated){
            return res.status(400).json({
                message: `Something went wrong`
            })
        }

        return res.status(200).json({
            data: updated,
            message: `Delivery Partner Application Status Updated`
        })
    } catch (error) {
        console.log(error)
    }
}

const getCompanyDetails = async (req, res) => {
    try {
        const { companyId } = req.params;
        
        const data = await companies.findById(companyId);

        if (!data) {
            return res.status(400).json({
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            data
        })
    } catch (error) {
        console.log(error)
    }
}

const updateCompanyStatus = async (req, res) => {
    try {
        const { companyId } = req.params;
        const statusData = req.body;
        console.log(statusData)
        const updated = await companies.findByIdAndUpdate(companyId, {
            ...statusData
        })

        if(!updated){
            return res.status(400).json({
                message: `Something went wrong`
            })
        }

        return res.status(200).json({
            data: updated,
            message: `Company Application Status Updated`
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    adminLogin,
    adminRegister,
    getCurrentAdmin,
    getDataNumbers,
    getAllPartners,
    getAllCompanies,
    getAllOrders,
    adminUpdatePassword,
    addDeliveryCity,
    addDeliveryZone,
    setDeliveryRates,
    getPartnerDetails,
    updatePartnerStatus,
    getCompanyDetails,
    updateCompanyStatus,
}