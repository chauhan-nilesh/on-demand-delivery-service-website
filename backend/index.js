import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import { configDotenv } from "dotenv";
import dbConnect from "./src/db/index.js";
import http from 'http';
import { Server as SocketIo } from 'socket.io';
import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const app = express()
const server = http.createServer(app);
const io = new SocketIo(server, {
    cors: {
        origin: "http://localhost:5173",
        method: ["GET", "POST"],
    }
});

configDotenv()

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

// io.use(cors())

const client = new Client();
client.on('ready', () => {
    console.log('Client is ready!');
});
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});
client.on('message_create', message => {
    console.log(message.body)
    console.log(message.from)
    if(message.body.toLowerCase() === "accept"){
        const mobileNo = message.from.split('@')[0].slice(-10); // 919920475160@c.us
    }
});
client.initialize();


app.get("/", (req, res) => {
    res.send("Hello World");
})

app.get("/test", (req, res) => {
    res.send("Test page");
})

createPartnerPayout()

import { adminRouter } from "./src/routes/admin.router.js";
import { companyRouter } from "./src/routes/company.router.js";
import { partnerRouter } from "./src/routes/partner.router.js";
import { orderRouter } from "./src/routes/order.router.js";
import { partnerPayoutRouter } from "./src/routes/partnerPayout.router.js";
import createPartnerPayout from "./src/utils/createPartnerPayout.js";
import { transactionRouter } from "./src/routes/transaction.router.js";

app.use("/api/admin", adminRouter)
app.use("/api/company", companyRouter)
app.use("/api/partner", partnerRouter)
app.use("/api/order", orderRouter)
app.use("/api/payout", partnerPayoutRouter)
app.use("/api/transaction", transactionRouter)

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

export { io, client }

dbConnect()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server port no. ${process.env.PORT}`)
        })
        server.listen(process.env.SOCKET_PORT, () => console.log(`Socket server running on port ${process.env.SOCKET_PORT}`));
    })
    .catch((error) => {
        console.log("Something went wrong", error)
    })