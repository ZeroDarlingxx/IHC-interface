const Match = require('../models/Match');

async function create(req, res) {
  try {
    const {
      torneio_id, time_casa_id, time_visitante_id, round,
      data_partida, local_partida, observacoes
    } = req.body;

    console.log('📥 Dados recebidos para criar partida:', req.body);

    if (!torneio_id || !time_casa_id || !time_visitante_id || !round) {
      return res.status(400).json({
        success: false,
        message: 'Torneio, times e rodada são obrigatórios'
      });
    }

    const matchId = await Match.create({
      torneio_id, time_casa_id, time_visitante_id, round,
      data_partida, local_partida, observacoes
    });

    console.log('✅ Partida criada com ID:', matchId);

    res.status(201).json({
      success: true,
      message: 'Partida criada com sucesso',
      matchId
    });

  } catch (error) {
    console.error('❌ ERRO ao criar partida:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor: ' + error.message
    });
  }
}

async function getByTournament(req, res) {
  try {
    const { torneioId } = req.params;
    console.log('📥 Buscando partidas do torneio:', torneioId);

    const matches = await Match.findByTournament(torneioId);

    res.json({
      success: true,
      data: matches,
      total: matches.length
    });

  } catch (error) {
    console.error('❌ ERRO ao buscar partidas:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;
    const match = await Match.findById(id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Partida não encontrada'
      });
    }

    res.json({
      success: true,
      data: match
    });

  } catch (error) {
    console.error('❌ ERRO ao buscar partida:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}

async function updateScore(req, res) {
  try {
    const { id } = req.params;
    const { placar_casa, placar_visitante, vencedor_id } = req.body;

    console.log('📥 Atualizando placar da partida:', id, req.body);

    if (placar_casa === undefined || placar_visitante === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Placar casa e visitante são obrigatórios'
      });
    }

    const Match = require('../models/Match');
    const updated = await Match.updateScore(id, placar_casa, placar_visitante, vencedor_id);

    if (updated) {
      res.json({
        success: true,
        message: 'Placar atualizado com sucesso'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Erro ao atualizar placar'
      });
    }

  } catch (error) {
    console.error('❌ ERRO ao atualizar placar:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor: ' + error.message
    });
  }
}

async function deleteMatch(req, res) {
  try {
    const { id } = req.params;
    console.log('🗑️ Tentando excluir partida:', id);

    const Match = require('../models/Match');
    const deleted = await Match.delete(id);

    if (deleted) {
      res.json({
        success: true,
        message: 'Partida excluída com sucesso'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Erro ao excluir partida'
      });
    }

  } catch (error) {
    console.error('❌ ERRO ao excluir partida:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor: ' + error.message
    });
  }
}

module.exports = {
    getByTournament,
    getById,
    create,
    updateScore,
    delete: deleteMatch
};