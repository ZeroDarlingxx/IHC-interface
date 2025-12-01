const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
  async register(req, res) {
    try {
      const { nome, apelido, email, senha, confirmarSenha } = req.body;


      if (!nome || !apelido || !email || !senha || !confirmarSenha) {
        return res.status(400).json({
          success: false,
          message: 'Todos os campos são obrigatórios'
        });
      }

      if (senha !== confirmarSenha) {
        return res.status(400).json({
          success: false,
          message: 'As senhas não coincidem'
        });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email já cadastrado'
        });
      }

      const userId = await User.create({ nome, apelido, email, senha });

      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: userId, 
          email: email,
          nome: nome 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        token,
        user: {
          id: userId,
          nome,
          apelido,
          email
        }
      });

    } catch (error) {
      console.error('❌ Erro no registro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // LOGIN 
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      const isPasswordValid = await User.verifyPassword(senha, user.senha);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: user.id_usuario, 
          email: user.email,
          nome: user.nome 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Retornar dados do usuário (sem senha)
      const userData = {
        id: user.id_usuario,
        nome: user.nome,
        apelido: user.apelido,
        email: user.email,
        bio: user.bio,
        foto_perfil: user.foto_perfil,
        data_criacao: user.data_criacao
      };

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        token,
        user: userData
      });

    } catch (error) {
      console.error('❌ Erro no login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      res.json({
        success: true,
        user
      });

    } catch (error) {
      console.error('❌ Erro ao buscar perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      const updated = await User.update(userId, updateData);

      if (updated) {
        const user = await User.findById(userId);
        res.json({
          success: true,
          message: 'Perfil atualizado com sucesso',
          user
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Erro ao atualizar perfil'
        });
      }

    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { senhaAtual, novaSenha, confirmarSenha } = req.body;

      if (!senhaAtual || !novaSenha || !confirmarSenha) {
        return res.status(400).json({
          success: false,
          message: 'Todos os campos são obrigatórios'
        });
      }

      if (novaSenha !== confirmarSenha) {
        return res.status(400).json({
          success: false,
          message: 'As novas senhas não coincidem'
        });
      }

      const user = await User.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      const isPasswordValid = await User.verifyPassword(senhaAtual, user.senha);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Senha atual incorreta'
        });
      }

      const updated = await User.updatePassword(userId, novaSenha);

      if (updated) {
        res.json({
          success: true,
          message: 'Senha alterada com sucesso'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Erro ao alterar senha'
        });
      }

    } catch (error) {
      console.error('❌ Erro ao alterar senha:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async verifyToken(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
      res.json({
        success: true,
        message: 'Token válido',
        user: {
          id: user.id_usuario,
          nome: user.nome,
          email: user.email,
          apelido: user.apelido
        }
      });

    } catch (error) {
      console.error('❌ Erro ao verificar token:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
};

module.exports = authController;