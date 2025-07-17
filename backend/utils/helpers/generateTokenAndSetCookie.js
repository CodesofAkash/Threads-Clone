import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
  
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: isProduction ? "none" : "strict", // "none" for cross-origin in production
    secure: isProduction, // HTTPS in production
    domain: isProduction ? undefined : undefined, // Let browser handle domain
  });

  return token;
}