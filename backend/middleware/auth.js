const jwt = require('jsonwebtoken');

const authMiddleware = {
  verifyToken: (req, res, next) => {
    try {
      // Obter token do header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Token de acesso não fornecido'
        });
      }

      const token = authHeader.split(' ')[1];
      
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = {
        id: decoded.id,
        email: decoded.email,
        nome: decoded.nome
      };
      
      next();
    } catch (error) {
      console.error('❌ Erro na verificação do token:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expirado'
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
  },

  isAdmin: (req, res, next) => {

    next();
  }
};

module.exports = authMiddleware;