import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "lax", // CSRF attacks cross-site request forgery attacks
    // Only mark the cookie Secure when served over HTTPS.
    // Set COOKIE_SECURE=false in .env if running behind plain HTTP (e.g. a dev/EC2 box without TLS).
    secure: process.env.NODE_ENV === "production" && process.env.COOKIE_SECURE !== "false",
  });

  return token;
};
