import nodeMailer from "nodemailer"
import jwt from "jsonwebtoken";
import { partners } from "../models/deliveryPartner.model.js"
import { io } from "../../index.js";
import { orders } from "../models/order.model.js";

const sendPartnerOtp = async (req, res) => {
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

const verifyPartnerOtp = async (req, res) => {
    try {
        const { otpToken } = req.body;

        const otp = await jwt.verify(otpToken, process.env.OTP_TOKEN_SECRET);

        return res.status(200).json({ message: "OTP send", otp })
    } catch (error) {
        console.log(error)
    }
}

const partnerRegister = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await partners.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                statusCode: 400,
                message: "Email is already registered"
            })
        }

        const user = await partners.create({
            email,
            password,
            isEmailVerified: true
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

const partnerLogin = async (req, res) => {
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
        const userExist = await partners.findOne({ email: emailId })

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

        const user = await partners.findOne({ email: emailId })

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

const getCurrentPartner = async (req, res) => {

    const partner = await partners.findById(req.user._id).select("-password")

    return res.status(200)
        .json({
            statusCode: 200,
            data: partner,
            message: "current user fetched successfully"
        })
}

const storePartnerDetails = async (req, res) => {
    try {
        const { partnerId, fullName, address, mobileNo, state, city, area, jobType, documentType } = req.body;
        const images = req.files;

        const partner = await partners.findById(partnerId)
        const partnerUpdated = await partners.findByIdAndUpdate(partnerId, {
            fullName,
            mobileNo,
            address,
            jobType,
            state,
            city,
            area,
            documentType,
            documentFile: images?.documentFile?.[0] ? images?.documentFile?.[0]?.filename : partner.documentFile || null,
            drivingLicense: images?.drivingLicense?.[0] ? images?.drivingLicense?.[0]?.filename : partner.drivingLicense || null,
            personalPhoto: images?.personalPhoto?.[0] ? images?.personalPhoto?.[0]?.filename : partner.personalPhoto || null
        })

        if (!partnerUpdated) {
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

const updatePartnerDetails = async (req, res) => {
    const { partnerId, fullName, mobileNo, address, jobType } = req.body;

    try {
        const updated = await partners.findByIdAndUpdate(partnerId, {
            fullName,
            mobileNo,
            address,
            jobType
        })

        if (!updated) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong while updating details"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Profile details updated!"
        })
    } catch (error) {
        console.log(error)
    }
}

const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedStatus = await partners.findByIdAndUpdate(req.user._id, {
            status: status === true ? "active" : "inactive"
        }, { new: true })

        if (!updatedStatus) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong while updating partner status"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: { status: updatedStatus.status },
            message: "Status updated!"
        })
    } catch (error) {
        console.log(error)
    }
}

const partnerUpdatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const partner = await partners.findById(req.user._id)

        const result = await partner.isPasswordCorrect(oldPassword)

        if (!result) {
            return res.status(400).json({
                statusCode: 400,
                message: "Old password is incorrect"
            })
        }

        const updatePassword = await partners.findByIdAndUpdate(req.user._id, {
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

const submitContactForm = async (req, res) => {
    try {
        const { email, firstName, lastName, subject, message } = req.body;

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
            subject: "New Contact Form Submission",
            html: `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Form Submission</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
    
            .container {
                background-color: #ffffff;
                max-width: 600px;
                margin: 20px auto;
                border: 1px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
            }
    
            .header {
                background-color: #FFB500;
                color: #000;
                text-align: center;
                padding: 20px;
            }
    
            .content {
                padding: 30px;
                color: #333;
            }
    
            .content h2 {
                color: #333;
                font-size: 22px;
            }
    
            .content p {
                font-size: 16px;
                line-height: 1.6;
            }
    
            .content .details {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 20px;
                border: 1px solid #ddd;
            }
    
            .content .details p {
                margin: 5px 0;
            }
    
            .footer {
                background-color: #333;
                color: white;
                text-align: center;
                padding: 15px;
                font-size: 12px;
            }
    
            .footer a {
                color: #fff;
                text-decoration: none;
            }
    
            .footer a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <!-- Email Header -->
            <div class="header">
                <h1>New Contact Form Submission</h1>
            </div>
    
            <!-- Email Content -->
            <div class="content">
                <h2>Hello Admin,</h2>
                <p>You have received a new contact form submission from your website.</p>
                <div class="details">
                    <h3>Contact Form Details:</h3>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>First Name:</strong> ${firstName}</p>
                    <p><strong>Last Name:</strong> ${lastName}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong> ${message}</p>
                </div>
                <p>Please respond to the user as soon as possible.</p>
            </div>
    
            <!-- Email Footer -->
            <div class="footer">
                <p>Thank you,</p>
                <p>Delivery Team</p>
            </div>
        </div>
    </body>
    
    </html>
    `,
        }

        emailProvider.sendMail(receiver, (error, emailResponse) => {
            if (error) {
                console.log("Something went wrong while sending email to admin")
            } else {
                console.log("Email sent successfully to admin")
            }
        })

        return res.status(200)
            .json({
                statusCode: 200, message: "Contact form submitted successfully"
            })
    } catch (error) {
        console.log(error)
    }
}

const setPaymentMethod = async (req, res) => {
    const { partnerId, type, bankName, ifsc, accountNo, accountHolderName, upiId } = req.body;
    console.log(req.body)
    try {
        let set;
        if (type === "bankTransfer") {
            set = await partners.findByIdAndUpdate(partnerId, {
                paymentDetails: {
                    type,
                    bankName,
                    ifsc,
                    accountNo,
                    accountHolderName,
                }
            })
        } else {
            set = await partners.findByIdAndUpdate(partnerId, {
                paymentDetails: {
                    type,
                    upiId
                }
            })
        }
        console.log(set)
        if (!set) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Payment details saved!"
        })
    } catch (error) {
        console.log(error)
    }
}

const getPartnerTodayEarning = async (req, res) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Start of today
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // End of today

    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    const firstDayOfMonth = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1); // First day of the current month

    try {
        const { partnerId } = req.params;
        const todayOrderDelivered = await orders.find({
            partner: partnerId,
            orderStatus: "Delivered",
            deliveryDateTime: { $gte: todayStart, $lt: todayEnd },
        })

        const todayEarning = todayOrderDelivered.reduce((total, order) =>
            total = total + (order.deliveryCharges || 0), 0
        )
        const weekOrderDelivered = await orders.find({
            partner: partnerId,
            orderStatus: "Delivered",
            deliveryDateTime: { $gte: lastWeek, $lt: today },
        })

        const weeklyEarnings = weekOrderDelivered.reduce((total, order) =>
            total = total + (order.deliveryCharges || 0), 0
        )

        const monthOrderDelivered = await orders.find({
            partner: partnerId,
            orderStatus: "Delivered",
            deliveryDateTime: { $gte: firstDayOfMonth, $lt: today },
        })

        const monthlyEarnings = monthOrderDelivered.reduce((total, order) =>
            total = total + (order.deliveryCharges || 0), 0
        )

        return res.status(200).json({
            todayEarning,
            weeklyEarnings,
            monthlyEarnings,
            weekRange: lastWeek.getDate()+"/"+lastWeek.getMonth()+"/"+lastWeek.getFullYear()+" - "+today.getDate()+"/"+today.getMonth()+"/"+today.getFullYear(),
            monthRange: firstDayOfMonth.getDate()+"/"+firstDayOfMonth.getMonth()+"/"+firstDayOfMonth.getFullYear()+" - "+today.getDate()+"/"+today.getMonth()+"/"+today.getFullYear()
        })
    } catch (error) {
        console.log(error)
    }
}

const updatePartnerLocation = async (req, res) => {
    try {
        const { partnerId, coordinates } = req.body;

        const partner = await partners.findByIdAndUpdate(partnerId, {
            location: coordinates
        })

        if (!partner) {
            return res.status(400).json({
                message: `Something went wrong`
            })
        }

        io.emit('location-update', { partnerId, coordinates });

        return res.status(200).json({
            message: `Partner location updated`
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    sendPartnerOtp,
    verifyPartnerOtp,
    partnerLogin,
    partnerRegister,
    getCurrentPartner,
    storePartnerDetails,
    updatePartnerDetails,
    updateStatus,
    partnerUpdatePassword,
    submitContactForm,
    setPaymentMethod,
    getPartnerTodayEarning,
    updatePartnerLocation
}