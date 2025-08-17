import jwt from "jsonwebtoken";
import User  from "../models/user/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Pega o token do header
      token = req.headers.authorization.split(" ")[1];

      // Verifica e decodifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Anexa usuário à requisição
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res.status(401).json({ message: "Token inválido ou expirado" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Não autorizado, sem token" });
  }
};
