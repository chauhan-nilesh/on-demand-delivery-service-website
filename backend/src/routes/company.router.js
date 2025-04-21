import { Router } from "express";
import { addPickupAddress, companyLogin, companyRegister, companyUpdatePassword, getCurrentCompany, getDeliveryCharges, getWallet, getZones, sendCompanyOtp, storeCompanyDetails, updateCompanyDetails, verifyCompanyOtp } from "../controllers/company.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getCompanyDetails } from "../controllers/admin.controller.js";

const router = Router()

router.route("/sendotp").post(sendCompanyOtp)

router.route("/verifyotp").post(verifyCompanyOtp)

router.route("/register").post(companyRegister)

router.route("/login").post(companyLogin)

router.route("/current-user").get(verifyJwt, getCurrentCompany)

router.route("/store-details").post(upload.fields([
    {
        name: "gstCertificate",
        maxCount: 1
    },
]), storeCompanyDetails)

router.route("/update-company").post(updateCompanyDetails)

router.route("/add-pickup-address").post(addPickupAddress)

router.route("/get-zones").get(getZones)

router.route("/get-wallet/:id").get(getWallet)

router.route("/get-charges").get(getDeliveryCharges)

router.route("/update-password").patch(verifyJwt, companyUpdatePassword)

router.route("/application-details/:companyId").get(getCompanyDetails)

export {router as companyRouter}