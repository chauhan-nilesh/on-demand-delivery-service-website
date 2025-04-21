import { partners } from "../models/deliveryPartner.model.js";
import { orders } from "../models/order.model.js";
import { partnerPayouts } from "../models/partnerPayout.model.js";


const payoutPartner = async (req, res) => {
    const { adminId, partnerId, week, paymentMethod, paymentTransactionNo, amount, status } = req.body;

    try {
        const payout = await partnerPayouts.create({
            owner: adminId,
            deliveryPartner: partnerId,
            week,
            paymentMethod,
            paymentTransactionNo,
            amount,
            status
        })

        const partner = await partners.findById(partnerId);
        partner.payouts.push(partner._id);
        await partner.save();

        if (!payout) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Something went wrong'
            })
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Transaction saved successfully"
        })

    } catch (error) {
        console.log(error)
    }
}

const getPartnerPayouts = async (req, res) => {
    const { partnerId } = req.params;

    try {
        const payouts = await partnerPayouts.find({ deliveryPartner: partnerId })

        if (!payouts) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Something went wrong'
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: payouts.reverse(),
            message: "All payouts fetched"
        })
    } catch (error) {
        console.log(error)
    }
}

const getAllPayouts = async (req, res) => {
    try {
        const payments = await partnerPayouts.find().populate("deliveryPartner").sort({ paymentWeekStart: -1 });

        return res.status(200).json({
            statusCode: 200,
            data: payments,
            message: "All Partners Payout fetched"
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            statusCode: 500,
            message: "something went wrong"
        })
    }
}

const getPayoutDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await partnerPayouts.findById(id).populate("deliveryPartner")

        if (!data) {
            return res.status(400).json({
                statusCode: 400,
                message: "Inavlid transaction ID"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: data,
            message: "Transaction data feteched"
        })
    } catch (error) {
        console.log(error)
    }
}

const paymentCompleted = async (req, res) => {
    try {
        const { id, paymentMethod, transactionNo, } = req.body;

        const payment = await partnerPayouts.findByIdAndUpdate(id, {
            paymentMethod,
            paymentTransactionNo: transactionNo,
            status: "completed"
        })

        if(!payment){
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Payment completed successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    payoutPartner,
    getPartnerPayouts,
    getAllPayouts,
    getPayoutDetails,
    paymentCompleted
}