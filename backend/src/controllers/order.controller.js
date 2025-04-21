import { orders } from "../models/order.model.js";
import { companies } from "../models/company.model.js"
import { partners } from "../models/deliveryPartner.model.js"
import mongoose from "mongoose";
import { wallets } from "../models/wallet.model.js";
import { transactions } from "../models/transaction.model.js";
import { client } from "../../index.js";

const { ObjectId } = mongoose.Types;

const createOrder = async (req, res) => {
    try {
        const { companyId, internalOrderId,
            pickupAddress,
            deliveryAddress,
            pickupAddressCoords,
            deliveryAddressCoords,
            pickupAddressZone,
            pinCode,
            customerName,
            customerPhoneNo,
            items,
            weight,
            paymentMode,
            amountToCollect,
            deliveryCharges } = req.body;

        const checkWalletBalance = await wallets.findOne({ owner: companyId })
        if (Number(checkWalletBalance.avlBalance) < Number(deliveryCharges)) {
            return res.status(400).json({
                statusCode: 400,
                message: "Insufficient wallet balance"
            })
        }

        const order = await orders.create({
            company: companyId,
            internalOrderId,
            pickupAddress: {
                text: pickupAddress,
                zone: pickupAddressZone,
                coordinates: pickupAddressCoords,
            },
            deliveryAddress: {
                text: deliveryAddress,
                coordinates: deliveryAddressCoords,
            },
            pinCode,
            customerName,
            customerPhoneNo,
            items,
            weight,
            paymentMode,
            amountToCollect,
            deliveryCharges
        })

        if (!order) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong"
            })
        }

        const createTransaction = await transactions.create({
            owner: companyId,
            wallet: checkWalletBalance._id,
            amount: deliveryCharges,
            type: "Debit",
            upiId: "---",
            status: "success"
        })

        const deductDeliveryCharges = await wallets.findByIdAndUpdate(checkWalletBalance._id, {
            avlBalance: Number(checkWalletBalance.avlBalance) - Number(deliveryCharges),
            totalSpend: Number(checkWalletBalance.totalSpend) + Number(deliveryCharges),
        })
        deductDeliveryCharges.transactions.push(createTransaction._id)
        await deductDeliveryCharges.save()

        const company = await companies.findById(companyId)
        company.orders.push(order._id)
        company.transactions.push(createTransaction._id)
        await company.save()

        const allPartnerAvailableInArea = await partners.find({ area: pickupAddressZone, status: "active" })

        allPartnerAvailableInArea.map((partner) => {
            const customerWhatsAppId = `91${partner?.mobileNo}@c.us`;
            const message = `New Order in your area! 🎉\n\nOrder Details:\nID: ${order?._id}\nPickup address: ${order?.pickupAddress?.text}\nDelivery address: ${order?.deliveryAddress?.text}\nEarning: ${order?.deliveryCharges}\n\nClick below link to accept order.\n${process.env.FRONTEND_URL}/partner/order/accept/${order?._id}`;
            ; (async () => {
                // Send the message
                await client.sendMessage(customerWhatsAppId, message)
            })()
            console.log('Order msg sent to delivery partner:', partner?.mobileNo);
        })

        return res.status(200).json({
            statusCode: 200,
            message: "Order placed successfully"
        })
    } catch (error) {
        console.log(error)
    }

}

const getCompanyAllOrders = async (req, res) => {
    try {
        const { companyId } = req.params;

        const allOrders = (await orders.find({ company: companyId }))

        return res.status(200).json({
            statusCode: 200,
            data: allOrders.reverse(),
            message: "All orders fetched"
        })
    } catch (error) {
        console.log(error)
    }
}

const getPartnerAllOrders = async (req, res) => {
    try {
        const { partnerId } = req.params;

        const allOrders = await orders.find({ partner: partnerId })

        return res.status(200).json({
            statusCode: 200,
            data: allOrders.reverse(),
            message: "All orders fetched"
        })
    } catch (error) {
        console.log(error)
    }
}

const getOrderData = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await orders.findById(id).populate("company")

        if (!order) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: order,
            message: "Order data fetched successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

const getCompanyDeliveredOrdersCount = async (req, res) => {
    try {
        const { id } = req.params;

        if (id === undefined) {
            return res.status(400).json({
                message: "Invalid ID"
            })
        }

        const order = await orders.countDocuments({ company: id, orderStatus: "Delivered" })

        return res.status(200).json({
            statusCode: 200,
            data: order,
            message: "Order data fetched successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

const acceptOrder = async (req, res) => {
    try {
        const { partnerId, orderId, status } = req.body;

        const orderAlreadyAllotted = await orders.findOne({ _id: orderId, isOrderAllotted: true })

        if (orderAlreadyAllotted) {
            return res.status(200).json({
                statusCode: 200,
                message: "Order is already allotted to other partner"
            })
        }

        if (status === 'Rejected') {
            return res.status(200).json({
                statusCode: 200,
                message: "Order request is rejected."
            })
        }

        const orderAlloted = await orders.findByIdAndUpdate(orderId, {
            partner: partnerId,
            isOrderAllotted: true,
            orderStatus: status
        })

        if (!orderAlloted) {
            return res.status(200).json({
                statusCode: 200,
                message: "Something went wrong"
            })
        }

        const partner = await partners.findById(partnerId);
        partner.orders.push(orderAlloted._id)
        await partner.save()

        return res.status(200).json({
            statusCode: 200,
            message: "Order accepted successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

const orderDelivered = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, partnerId } = req.body;

        const date = new Date()

        const updated = await orders.findByIdAndUpdate(orderId, {
            orderStatus: status,
            deliveryDateTime: new Date(date)
        })

        if (!updated) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong"
            })
        }

        const partner = await partners.findById(partnerId)

        const upadetdEarning = await partners.findByIdAndUpdate(partnerId, {
            earning: Number(partner.earning) + Number(updated.deliveryCharges)
        })

        return res.status(200).json({
            statusCode: 200,
            message: "Order status updated!"
        })
    } catch (error) {
        console.log(error)
    }
}

const getPartnerOrderStatusCount = async (req, res) => {
    try {
        const { partnerId } = req.params;
        if (!partnerId) {
            return res.status(400).json({
                statusCode: 400,
                message: "Partner ID is unavailable"
            })
        }
        const pendingOrders = await orders.countDocuments({ partner: partnerId, orderStatus: "Accepted" })

        const deliveredOrders = await orders.countDocuments({ partner: partnerId, orderStatus: "Delivered" })

        return res.status(200).json({
            data: {
                pendingOrders,
                deliveredOrders
            },
            message: "Data Fetched"
        })
    } catch (error) {
        console.log(error)
    }
}

const getOrdersByDate = async (req, res) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Start of today
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // End of today

    const firstDayOfMonth = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1); // First day of the current month
    const firstDayOfYear = new Date(todayStart.getFullYear(), 0, 1); // First day of the current year

    const now = new Date(); // Current date and time
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1); // Date a year ago from now

    try {
        const { partnerId } = req.params;
        // Today's orders
        const todayOrders = await orders.countDocuments({ partner: partnerId }, {
            createdAt: { $gte: todayStart, $lt: todayEnd },
        });

        const todayPendingOrders = await orders.countDocuments({ partner: partnerId, orderStatus: "Pending" }, {
            createdAt: { $gte: todayStart, $lt: todayEnd },
        });

        const todayDeliveredOrders = await orders.countDocuments({ partner: partnerId, orderStatus: "Delivered" }, {
            createdAt: { $gte: todayStart, $lt: todayEnd },
        });

        // Current month's orders
        const monthOrders = await orders.countDocuments({ partner: partnerId }, {
            createdAt: { $gte: firstDayOfMonth, $lt: todayStart },
        });

        // One-year orders
        const yearOrders = await orders.countDocuments({ partner: partnerId }, {
            createdAt: { $gte: oneYearAgo },
        });

        // All-time orders
        const allOrders = await orders.countDocuments({ partner: partnerId },);

        return res.status(200).json({
            today: { todayOrders, todayPendingOrders, todayDeliveredOrders },
            monthOrders,
            yearOrders,
            allOrders
        });
    } catch (err) {
        console.error('Error retrieving orders:', err);
    }
};



// Function to calculate earnings for current week
const calculateWeeklyEarnings = async (deliveryPartner) => {
    const today = new Date();

    // Adjust for weeks starting on Sunday (0 - Sunday to 6 - Saturday)
    const dayOfWeek = today.getDay(); // 0 (Sunday) - 6 (Saturday)
    const sundayOffset = -dayOfWeek; // Offset to go to start of the week
    const saturdayOffset = 6 - dayOfWeek; // Offset to go to end of the week

    // Calculate start (Sunday) and end (Saturday) of the current week
    const sunday = new Date(today);
    sunday.setDate(today.getDate() + sundayOffset);
    sunday.setHours(0, 0, 0, 0); // Start of Sunday

    const saturday = new Date(today);
    saturday.setDate(today.getDate() + saturdayOffset);
    saturday.setHours(23, 59, 59, 999); // End of Saturday

    try {
        const weeklyEarnings = await orders.aggregate([
            {
                $match: {
                    partner: new ObjectId(deliveryPartner), // Match the delivery partner
                    createdAt: { $gte: sunday, $lte: saturday } // Match orders within this week
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: "$deliveryCharges" } // Sum the delivery charges
                }
            }
        ]);

        return weeklyEarnings.length > 0 ? weeklyEarnings[0].totalEarnings : 0;
    } catch (err) {
        console.error('Error calculating weekly earnings:', err);
        return 0;
    }
};

// Example Usage
const getWeeklyEarnings = async (req, res) => {
    try {
        const { partnerId } = req.params;

        const weeklyEarnings = await calculateWeeklyEarnings(partnerId);

        return res.status(200).json({ weeklyEarnings });

    } catch (error) {
        console.log(error);
    }
};

const getOrderTrackingDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        const orderDetails = await orders.findById(orderId).populate("company")

        if (!orderDetails) {
            return res.status(400).json({
                statusCode: 400,
                message: "Something went wrong while fetching order tracking details"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            data: orderDetails,
            message: "Data fetched!"
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            statusCode: 400,
            message: "Something went wrong while fetching order tracking details"
        })
    }
}

const getOrdersOfCurrentWeek = async (req, res) => {
    try {
        const { companyId } = req.params;
        // Get current date and start of the week (Sunday)
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
        startOfWeek.setHours(0, 0, 0, 0);

        // End of the week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const getOrders = await orders.aggregate([
            {
                $match: {
                    company: new ObjectId(companyId),
                    createdAt: { $gte: startOfWeek, $lte: endOfWeek } // Filter orders of this week
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$createdAt" }, // Group by day of the week (1 = Sunday, 7 = Saturday)
                    count: { $sum: 1 } // Count number of orders per day
                }
            },
            {
                $sort: { "_id": 1 } // Sort by day of the week
            }
        ]);

        // Convert MongoDB dayOfWeek (1 = Sunday) to readable format
        const dayMap = {
            1: "Sun",
            2: "Mon",
            3: "Tue",
            4: "Wed",
            5: "Thr",
            6: "Fri",
            7: "Sat",
        };

        // Initialize all days with 0 orders
        const result = Object.keys(dayMap).map(dayNum => ({
            day: dayMap[dayNum],
            count: 0
        }));

        // Update result with actual order counts
        getOrders.forEach(order => {
            const index = parseInt(order._id, 10) - 1; // Convert MongoDB dayOfWeek (1-based) to 0-based index
            result[index].count = order.count;
        });

        return res.status(200).json({ data: result });
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
};

const getOrdersLastSixMonthsByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;

        if (!companyId) {
            throw new Error("Company ID is required");
        }

        const today = new Date();
        const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1); // First day of 6 months ago
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of current month
        endOfMonth.setHours(23, 59, 59, 999);

        const getOrders = await orders.aggregate([
            {
                $match: {
                    company: new ObjectId(companyId), // Filter by companyId
                    createdAt: { $gte: sixMonthsAgo, $lte: endOfMonth } // Last 6 months including current month
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 } // Count orders per month
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year & month
            }
        ]);

        // Short 3-letter month names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const result = [];

        // Generate last 6 months with default count = 0
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            result.push({
                month: monthNames[date.getMonth()],
                year: date.getFullYear(),
                count: 0
            });
        }

        // Merge actual order counts into the result array
        getOrders.forEach(order => {
            const index = result.findIndex(r => r.month === monthNames[order._id.month - 1] && r.year === order._id.year);
            if (index !== -1) {
                result[index].count = order.count;
            }
        });

        return res.status(200).json({ data: result });
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
};

const getAllOrdersOfCurrentWeek = async (req, res) => {
    try {

        // Get current date and start of the week (Sunday)
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
        startOfWeek.setHours(0, 0, 0, 0);

        // End of the week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const getOrders = await orders.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfWeek, $lte: endOfWeek } // Filter orders of this week
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$createdAt" }, // Group by day of the week (1 = Sunday, 7 = Saturday)
                    count: { $sum: 1 } // Count number of orders per day
                }
            },
            {
                $sort: { "_id": 1 } // Sort by day of the week
            }
        ]);

        // Convert MongoDB dayOfWeek (1 = Sunday) to readable format
        const dayMap = {
            1: "Sun",
            2: "Mon",
            3: "Tue",
            4: "Wed",
            5: "Thr",
            6: "Fri",
            7: "Sat",
        };

        // Initialize all days with 0 orders
        const result = Object.keys(dayMap).map(dayNum => ({
            day: dayMap[dayNum],
            count: 0
        }));

        // Update result with actual order counts
        getOrders.forEach(order => {
            const index = parseInt(order._id, 10) - 1; // Convert MongoDB dayOfWeek (1-based) to 0-based index
            result[index].count = order.count;
        });

        return res.status(200).json({ data: result });
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
};

const getAllOrdersLastSixMonths = async (req, res) => {
    try {

        const today = new Date();
        const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1); // First day of 6 months ago
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of current month
        endOfMonth.setHours(23, 59, 59, 999);

        const getOrders = await orders.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo, $lte: endOfMonth } // Last 6 months including current month
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 } // Count orders per month
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year & month
            }
        ]);

        // Short 3-letter month names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const result = [];

        // Generate last 6 months with default count = 0
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            result.push({
                month: monthNames[date.getMonth()],
                year: date.getFullYear(),
                count: 0
            });
        }

        // Merge actual order counts into the result array
        getOrders.forEach(order => {
            const index = result.findIndex(r => r.month === monthNames[order._id.month - 1] && r.year === order._id.year);
            if (index !== -1) {
                result[index].count = order.count;
            }
        });

        return res.status(200).json({ data: result });
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
};

const orderPicked = async (req, res) => {
    try {
        const { id } = req.body;

        const order = await orders.findByIdAndUpdate(id, {
            orderStatus: "Picked"
        })

        if (!order) {
            return res.status(400).json({
                statusCode: 400,
                message: "Order ID is unavailable"
            })
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Order status updated"
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    createOrder,
    getCompanyAllOrders,
    getPartnerAllOrders,
    acceptOrder,
    getOrderData,
    getCompanyDeliveredOrdersCount,
    orderDelivered,
    getPartnerOrderStatusCount,
    getOrdersByDate,
    getWeeklyEarnings,
    getOrderTrackingDetails,
    getOrdersOfCurrentWeek,
    getOrdersLastSixMonthsByCompany,
    getAllOrdersOfCurrentWeek,
    getAllOrdersLastSixMonths,
    orderPicked
}