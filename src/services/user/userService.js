import User from "../../models/user/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 🔹 Registrar novo usuário
export const registerNewUser = async ({ userName, email, password }) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("Usuário já existe");

  const user = await User.create({ userName, email, password });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return {
    token,
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
    },
  };
};

// 🔹 Login de usuário
export const loginExistingUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Usuário não encontrado");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Senha inválida");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return {
    token,
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
    },
  };
};

// 🔹 Listar todos os usuários (sem senha)
export const fetchAllUsers = async () => {
  return await User.find({}, "-password").sort({ createdAt: -1 });
};
