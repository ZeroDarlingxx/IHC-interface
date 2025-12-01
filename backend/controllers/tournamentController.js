const Tournament = require('../models/Tournament');

const tournamentController = {
  async create(req, res) {
    try {
      const { nome, descricao, jogo, formato, data_inicio, data_fim, premio, max_equipes } = req.body;

      if (!nome || !jogo || !formato) {
        return res.status(400).json({
          success: false,
          message: 'Nome, jogo e formato são obrigatórios'
        });
      }

      const id_usuario_criador = 1;
      const tournamentId = await Tournament.create({
        id_usuario_criador, nome, descricao, jogo, formato,
        data_inicio, data_fim, premio: premio || 0, max_equipes: max_equipes || 16
      });

      res.status(201).json({
        success: true,
        message: 'Torneio criado com sucesso',
        tournamentId
      });

    } catch (error) {
      console.error('Erro ao criar torneio:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async getAll(req, res) {
    try {
      const tournaments = await Tournament.findAll();
      res.json({
        success: true,
        data: tournaments,
        total: tournaments.length
      });
    } catch (error) {
      console.error('Erro ao buscar torneios:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const tournament = await Tournament.findById(id);

      if (!tournament) {
        return res.status(404).json({
          success: false,
          message: 'Torneio não encontrado'
        });
      }

      res.json({
        success: true,
        data: tournament
      });
    } catch (error) {
      console.error('Erro ao buscar torneio:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
};

module.exports = tournamentController;
