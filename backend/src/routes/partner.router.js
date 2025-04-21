import { Router } from "express";
import { getCurrentPartner, getPartnerTodayEarning, partnerLogin, partnerRegister, partnerUpdatePassword, sendPartnerOtp, setPaymentMethod, storePartnerDetails, submitContactForm, updatePartnerDetails, updatePartnerLocation, updateStatus, verifyPartnerOtp } from "../controllers/partner.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from '../middlewares/multer.middleware.js'
import { getPartnerDetails } from "../controllers/admin.controller.js";

const router = Router()

router.route("/sendotp").post(sendPartnerOtp)

router.route("/verifyotp").post(verifyPartnerOtp)

router.route("/register").post(partnerRegister)

router.route("/login").post(partnerLogin)

router.route("/current-user").get(verifyJwt, getCurrentPartner)

router.route("/update-status").patch(verifyJwt,updateStatus)

router.route("/store-details").post(upload.fields([
    {
        name: "documentFile",
        maxCount: 1
    },
    {
        name: "drivingLicense",
        maxCount: 1
    },
    {
        name: "personalPhoto",
        maxCount: 1
    },
]), storePartnerDetails)

router.route("/update-partner").post(updatePartnerDetails)

router.route("/update-password").patch(verifyJwt, partnerUpdatePassword)

router.route("/submit-contact-form").post(submitContactForm)

router.route("/set-payment-details").post(setPaymentMethod)

router.route("/application-details/:partnerId").get(getPartnerDetails)

router.route("/today-earning/:partnerId").get(getPartnerTodayEarning)

router.route("/update-location").post(updatePartnerLocation)

export { router as partnerRouter }