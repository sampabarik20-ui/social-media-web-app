import jwt from "jsonwebtoken";


const authMiddleware = (req, res, next) => {
  const header = req.headers["authorization"];

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized: Token not provided",
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
  ...decoded,
  _id: decoded._id || decoded.id,
};
    next();
  } catch (err) {
  console.error(err);
  res.status(500).json({
    message: err.message,
  });
  }
};
export default authMiddleware;
