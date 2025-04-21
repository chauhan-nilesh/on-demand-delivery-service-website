import cron from "node-schedule";
import { partners } from "../models/deliveryPartner.model.js";
import { orders } from "../models/order.model.js";
import { partnerPayouts } from "../models/partnerPayout.model.js";

// Admin ID to associate with payout records
const adminId = "67715a316d1e555dd7ce0fd1"; // Replace with actual admin ID

const createPartnerPayout = () => {

    // Schedule job for every Saturday at 11:00 PM
    cron.scheduleJob("0 23 * * 6", async () => {
        try {
            const today = new Date();

            // Get last Sunday's date
            const lastSunday = new Date(today);
            lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay());
            lastSunday.setHours(0, 0, 0, 0); // Start of the day

            // Get last Saturday's date
            const lastSaturday = new Date(lastSunday);
            lastSaturday.setDate(lastSaturday.getDate() + 6);
            lastSaturday.setHours(23, 59, 59, 999); // End of the day

            // Find all delivery partners
            const deliveryPartners = await partners.find();

            for (const partner of deliveryPartners) {
                // Find all deliveries created in the week
                const deliveries = await orders.find({
                    partner: partner._id,
                    deliveryDateTime: { $gte: lastSunday, $lte: lastSaturday }, // Filter based on the createdAt timestamp
                });

                // Calculate total amount for the week
                const totalAmount = deliveries.reduce((acc, curr) => acc + curr.deliveryCharges, 0);

                if (totalAmount > 0) {
                    // Create a pending payment record
                    await partnerPayouts.create({
                        owner: adminId,
                        deliveryPartner: partner._id,
                        paymentWeekStart: lastSunday,
                        paymentWeekEnd: lastSaturday,
                        amount: totalAmount,
                        status: "pending",
                    });
                }
            }
        } catch (error) {
            console.error("Error running scheduled job:", error);
        }
    });
}

export default createPartnerPayout
