import jwt from "jsonwebtoken";
import { clientErorResponse } from "../util/errorResponse.js";

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    //check if header present
    if (!authHeader) return clientErorResponse(res, 401, "Token required!");

    const token = authHeader.split(" ")[1];

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //attach user to req
    req.user = decoded;
    next();
  } catch (err) {
    return clientErorResponse(res, 401, "Invalid token");
  }
}

export default verifyToken;