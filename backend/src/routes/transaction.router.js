import { Router } from "express";
import { createTransaction, transactionCompleted } from "../controllers/transaction.controller.js";

const router = Router()

router.route("/create").post(createTransaction)

router.route("/complete").post(transactionCompleted)

export {router as transactionRouter}