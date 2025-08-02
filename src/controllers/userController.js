import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Verifica se já existe
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Usuário já existe' });

    // Cria usuário
    const user = await User.create({ userName, email, password });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca usuário pelo email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    // Verifica senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Senha inválida' });

    // Gera token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login bem-sucedido',
      token,
      user: {
        id: user._id,
        userName: user.userName, // ✅ Incluído
        email: user.email
      }
    });
  } catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Erro no servidor', error: error.message });
}

};

