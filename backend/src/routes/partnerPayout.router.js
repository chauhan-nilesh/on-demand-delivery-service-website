import { Router } from "express";
import { getAllPayouts, getPartnerPayouts, getPayoutDetails, paymentCompleted, payoutPartner } from "../controllers/partnerPayout.controller.js";

const router = Router()

router.route("/create").post(payoutPartner)

router.route("/get-partner-payouts/:partnerId").get(getPartnerPayouts)

router.route("/get-all").get(getAllPayouts)

router.route("/get-transaction-details/:id").get(getPayoutDetails)

router.route("/payment").put(paymentCompleted)

export {router as partnerPayoutRouter}