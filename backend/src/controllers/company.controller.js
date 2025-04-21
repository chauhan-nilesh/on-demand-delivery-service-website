import nodeMailer from "nodemailer"
import jwt from "jsonwebtoken";
import { companies } from "../models/company.model.js"
import { wallets } from "../models/wallet.model.js";
import { admins } from "../models/admin.model.js";

const globalAdminId = "67cc49688235ed28e3193634";

const sendCompanyOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const OTP = Math.floor(1 + Math.random() * 9000);

        const emailProvider = nodeMailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.OTP_EMAIL_ID,
                pass: process.env.OTP_EMAIL_PASS
            },
            tls: { rejectUnauthorized: false }
        })

        const receiver = {
            from: `Delivery <${process.env.OTP_EMAIL_ID}>`,
            to: email,
            subject: "OTP Verification",
            html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Requested</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 50px auto;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: white;
                padding: 20px;
                text-align: center;
                border-bottom: 4px solid #d1a700;
            }
            .header img {
                width: 120px;
            }
            .content {
                padding: 20px 30px;
                color: #333;
            }
            .content h2 {
                font-size: 24px;
                color: #333;
            }
            .otp-box {
                background-color: #f9f9f9;
                padding: 15px;
                margin: 20px 0;
                text-align: center;
                border: 2px dashed #d1a700;
                border-radius: 8px;
            }
            .otp-box .otp {
                font-size: 28px;
                font-weight: bold;
                color: #000000;
            }
            .content p {
                line-height: 1.7;
                font-size: 16px;
                color: #555;
            }
            .support {
                text-align: center;
                margin-top: 20px;
                margin-bottom: 20px;
            }
            .support a {
                background-color: #ee7401;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                font-size: 16px;
                border-radius: 50px;
                display: inline-block;
                margin-top: 10px;
                font-weight: bold;
                transition: background-color 0.3s;
            }
            .support a:hover {
                background-color: #fd6900;
            }
            .footer {
                background-color: #f9f9f9;
                padding: 15px 30px;
                text-align: center;
                font-size: 12px;
                color: #888;
                border-top: 1px solid #eee;
            }
            .footer p {
                margin: 5px 0;
            }
            .footer a {
                color: #007ad9;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header with logo and background -->
            <div class="header">
                <img src="https://res.cloudinary.com/dodtn64kw/image/upload/v1741506144/logo_k0zwjp.png" alt="Logo">
            </div>
    
            <!-- Main Content -->
            <div class="content">
                <h2>OTP Requested</h2>
                <p>Hi,</p>
                <p>Your One Time Password (OTP) is:</p>
    
                <!-- OTP Box with dashed border -->
                <div class="otp-box">
                    <span class="otp">${OTP}</span>
                </div>
    
                <p>This password will expire in ten minutes if not used.</p>
                <p>If you did not request this, please contact our customer support immediately to secure your account.</p>
    
                <p>Thank You,<br><strong>Delivery Team</strong></p>
            </div>
    
            <!-- Footer with security warning -->
            <div class="footer">
                <p>Never share your OTP with anyone. Even if the caller claims to be from Eazzy.</p>
                <p>Sharing these details can lead to unauthorized access to your account.</p>
                <p>This is an automatically generated email, please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    `,
        }

        const otpToken = await jwt.sign({ otp: OTP }, process.env.OTP_TOKEN_SECRET, { expiresIn: process.env.OTP_TOKEN_EXPIRY })

        emailProvider.sendMail(receiver, (error, emailResponse) => {
            if (error) {
                console.log(error)
                return res.status(400).json({ message: "Something went wrong" })
            } else {
                return res.status(200).json({ message: "OTP send successfully on your email account", otp: otpToken })
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const verifyCompanyOtp = async (req, res) => {
    try {
        const { otpToken } = req.body;

        const otp = await jwt.verify(otpToken, process.env.OTP_TOKEN_SECRET);

        return res.status(200).json({ message: "OTP send", otp })
    } catch (error) {
        console.log(error)
    }
}

const companyRegister = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await companies.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                statusCode: 400,
                message: "Email is already registered"
            })
        }

        const user = await companies.create({
            email,
            password,
            isEmailVerified: true
        })

        const wallet = await wallets.create({
            owner: user._id,
        })

        const addedWallet = await companies.findByIdAndUpdate(user._id, {
            wallet: wallet._id
        })

        const token = await user.generateAccessToken()

        if (user) {
            const emailProvider = nodeMailer.createTransport({
                service: "gmail",
                secure: true,
                port: 465,
                auth: {
                    user: process.env.OTP_EMAIL_ID,
                    pass: process.env.OTP_EMAIL_PASS
                },
                tls: { rejectUnauthorized: false }
            })

            const receiver = {
                from: `Delivery <${process.env.OTP_EMAIL_ID}>`,
                to: process.env.ADMIN_EMAIL_ID,
                subject: "New user registered on delivery",
                text: `User Email: ${user.email}`,
            }

            emailProvider.sendMail(receiver, (error, emailResponse) => {
                if (error) {
                    console.log("Something went wrong while sending email to admin")
                } else {
                    console.log("Email sent successfully to admin")
                }
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: user,
            token: token,
            message: "Company registered Successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

const companyLogin = async (req, res) => {
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
        const userExist = await companies.findOne({ email: emailId })

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

        const user = await companies.findOne({ email: emailId })

        return res.status(200).json({
            statusCode: 200,
            data: user,
            token: token,
            message: "Logged In Successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

const getCurrentCompany = async (req, res) => {

    const company = await companies.findById(req.user._id).select("-password")

    return res.status(200)
        .json({
            statusCode: 200,
            data: company,
            message: "current user fetched successfully"
        })
}

const storeCompanyDetails = async (req, res) => {
    try {
        const { companyId, name, businessType, mobileNo, address1, address2, state, city, pinCode, gstNumber } = req.body;
        const images = req.files;

        const company = await companies.findById(companyId)
        const companyUpdated = await companies.findByIdAndUpdate(companyId, {
            name,
            businessType,
            mobileNo,
            address1,
            address2,
            state,
            city,
            pinCode,
            gstNumber,
            gstCertificate: images?.gstCertificate?.[0] ? images?.gstCertificate?.[0]?.filename : company.gstCertificate || null
        })

        if (!companyUpdated) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Your details submitted successfully!"
        })
    } catch (error) {
        console.log(error)
    }
}

const updateCompanyDetails = async (req, res) => {
    try {
        const { companyId, name, businessType, mobileNo, address1, address2, state, city, pinCode } = req.body;

        const companyUpdated = await companies.findByIdAndUpdate(companyId, {
            name,
            businessType,
            mobileNo,
            address1,
            address2,
            state,
            city,
            pinCode
        })

        if (!companyUpdated) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Company Profile Updated!"
        })
    } catch (error) {
        console.log(error)
    }
}

const addPickupAddress = async (req, res) => {
    try {
        const { companyId, label, zone, address, coords } = req.body;

        const added = await companies.findById(companyId)
        added.pickupAddresses.push({ label, zone, address, coords })
        await added.save();

        return res.status(200).json({
            statusCode: 200,
            message: "Address added!"
        })
    } catch (error) {
        console.log(error)
    }
}

const companyUpdatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const company = await companies.findById(req.user._id)

        const result = await company.isPasswordCorrect(oldPassword)

        if (!result) {
            return res.status(400).json({
                statusCode: 400,
                message: "Old password is incorrect"
            })
        }

        const updatePassword = await companies.findByIdAndUpdate(req.user._id, {
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

const getDeliveryCharges = async (req, res) => {
    try {
        const data = await admins.findById(globalAdminId)

        return res.status(200).json({
            data: data.deliveryRates
        })
    } catch (error) {
        console.log(error)
    }
}

const getZones = async (req, res) => {
    try {
        const admin = await admins.findById(globalAdminId)

        if (!admin) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: admin.zones,
            message: "Zones fetached"
        })
    } catch (error) {
        console.log(error)
    }
}

const getWallet = async (req, res) => {
    try {
        const { id } = req.params;

        if (id === undefined || id === "") {
            return res.status(400).json({
                message: "Invalid ID"
            })
        }

        const wallet = await wallets.findOne({ owner: id }).populate("transactions")

        return res.status(200).json({
            data: wallet
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    companyLogin,
    companyRegister,
    sendCompanyOtp,
    verifyCompanyOtp,
    getCurrentCompany,
    storeCompanyDetails,
    updateCompanyDetails,
    addPickupAddress,
    companyUpdatePassword,
    getDeliveryCharges,
    getZones,
    getWallet
}