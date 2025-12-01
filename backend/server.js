const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/auth');
const tournamentRoutes = require('./routes/tournaments');
const teamRoutes = require('./routes/teams');
const matchRoutes = require('./routes/matches'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

testConnection();

// Debug
console.log('=== DEBUG MATCHES ===');
try {
  console.log('MatchController:', require('./controllers/matchController'));
} catch (error) {
  console.log('❌ Erro ao carregar matchController:', error.message);
}
console.log('=== FIM DEBUG ===');

// ROTAS
app.use('/api/auth', authRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 WolfPack API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API WolfPack!',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      tournaments: '/api/tournaments',
      teams: '/api/teams',
      matches: '/api/matches'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🎮 WolfPack Server rodando na porta ${PORT}`);
});

module.exports = app;
