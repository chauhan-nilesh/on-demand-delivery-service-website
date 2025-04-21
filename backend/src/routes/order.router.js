import { Router } from "express";
import { acceptOrder, createOrder, getAllOrdersLastSixMonths, getAllOrdersOfCurrentWeek, getCompanyAllOrders, getCompanyDeliveredOrdersCount, getOrderData, getOrdersByDate, getOrdersLastSixMonthsByCompany, getOrdersOfCurrentWeek, getOrderTrackingDetails, getPartnerAllOrders, getPartnerOrderStatusCount, getWeeklyEarnings, orderDelivered, orderPicked } from "../controllers/order.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/create").post(createOrder)

router.route("/get-company-orders/:companyId").get(getCompanyAllOrders)

router.route("/get-partner-orders/:partnerId").get(getPartnerAllOrders)

router.route("/get-data/:id").get(getOrderData)

router.route("/get-company-delivered-count/:id").get(getCompanyDeliveredOrdersCount)

router.route("/accept-order").post(acceptOrder)

router.route("/update-status/:orderId").patch(orderDelivered)

router.route("/get-tracking-details/:orderId").get(getOrderTrackingDetails)

router.route("/get-partner-count/:partnerId").get(getPartnerOrderStatusCount)

router.route("/get-partner-date/:partnerId").get(getOrdersByDate)

router.route("/get-week-earning/:partnerId").get(getWeeklyEarnings)

router.route("/get-orders-current-week/:companyId").get(getOrdersOfCurrentWeek)

router.route("/get-orders-of-months/:companyId").get(getOrdersLastSixMonthsByCompany)

router.route("/get-all-orders-current-week").get(verifyJwt, getAllOrdersOfCurrentWeek)

router.route("/get-all-orders-of-months").get(verifyJwt, getAllOrdersLastSixMonths)

router.route("/picked/:id").get(orderPicked)

export { router as orderRouter }