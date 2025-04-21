import { Router } from "express";
import { addDeliveryCity, addDeliveryZone, adminLogin, adminRegister, adminUpdatePassword, getAllCompanies, getAllOrders, getAllPartners, getCompanyDetails, getCurrentAdmin, getDataNumbers, getPartnerDetails, setDeliveryRates, updateCompanyStatus, updatePartnerStatus } from "../controllers/admin.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/login").post(adminLogin)

router.route("/register").post(adminRegister)

router.route("/current-user").get(verifyJwt,getCurrentAdmin)

router.route("/data-numbers").get(verifyJwt,getDataNumbers)

router.route("/get-partners").get(verifyJwt,getAllPartners)

router.route("/get-companies").get(verifyJwt,getAllCompanies)

router.route("/get-orders").get(verifyJwt,getAllOrders)

router.route("/update-password").patch(verifyJwt,adminUpdatePassword)

router.route("/add-delivery-cities").post(addDeliveryCity)

router.route("/add-delivery-zone").post(addDeliveryZone)

router.route("/set-delivery-rates").post(setDeliveryRates)

router.route("/partner-details/:partnerId").get(getPartnerDetails)

router.route("/update-partner/:partnerId/status").put(verifyJwt,updatePartnerStatus)

router.route("/company-details/:companyId").get(getCompanyDetails)

router.route("/update-company/:companyId/status").put(verifyJwt,updateCompanyStatus)

export {router as adminRouter}