import { companies } from "../models/company.model.js";
import { transactions } from "../models/transaction.model.js";
import { wallets } from "../models/wallet.model.js";


const createTransaction = async (req, res) => {
    try {
        const { companyId, wallet, amt } = req.body;

        const created = await transactions.create({
            owner: companyId,
            wallet,
            amount: amt,
            type: "Credit",
            status: "fail"
        })

        if (!created) {
            return res.status(400).json({
                message: "Failed while initiating transaction"
            })
        }

        const company = await companies.findById(companyId)
        company.transactions.push(created._id)
        await company.save()

        const walletData = await wallets.findById(wallet)
        walletData.transactions.push(created._id)
        await walletData.save()

        return res.status(200).json({
            data: created,
            message: "Transaction initiated"
        })
    } catch (error) {
        console.log(error)
    }
}

const transactionCompleted = async (req, res) => {
    try {
        const { companyId, tId, status, upiId } = req.body;

        if(!tId){
            return res.status(400).json({
                message: "Something went wrong while processing transaction"
            })
        }

        const transaction = await transactions.findByIdAndUpdate(tId,{
            upiId,
            status
        })

        const wallet = await wallets.findOne({owner: companyId})

        const updatedWallet = await wallets.findOneAndUpdate({owner: companyId}, {
            avlBalance: wallet.avlBalance + transaction.amount
        })

        if(!transaction){
            return res.status(400).json({
                message: "Something went wrong while completing transaction"
            })
        }

        return res.status(200).json({
            message: "Transaction completed successfully"
        })

    } catch (error) {
        console.group(error)
    }
}

export {
    createTransaction,
    transactionCompleted
}