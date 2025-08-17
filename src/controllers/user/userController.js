import { registerNewUser, loginExistingUser, fetchAllUsers } from "../../services/user/userService.js";

// 🔹 Registrar usuário
export const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const result = await registerNewUser({ userName, email, password });

    res.status(201).json({
      message: "Usuário criado com sucesso",
      ...result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Login de usuário
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginExistingUser({ email, password });

    res.json({
      message: "Login bem-sucedido",
      ...result,
    });
  } catch (error) {
    const status = error.message.includes("não encontrado") ? 404 :
                   error.message.includes("Senha inválida") ? 401 : 400;

    res.status(status).json({ message: error.message });
  }
};

// 🔹 Listar usuários
export const getAllUsers = async (req, res) => {
  try {
    const users = await fetchAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários", error: error.message });
  }
};
