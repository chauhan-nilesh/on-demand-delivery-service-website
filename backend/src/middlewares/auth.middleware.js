import jwt from "jsonwebtoken";

export const verifyJwt = async function (req, res, next) {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        
        if (!token) {
            return res.status(400).json({
                statusCode: 400,
                message: "Unauthorized request"
            })
        } else {
            const tokenDetails = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
                req.user = tokenDetails
                next()
        }
    } catch (error) {
        console.log(error)
    }
}
