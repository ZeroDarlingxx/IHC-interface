const { pool } = require('../config/database');

class Match {
  static async create(matchData) {
    const {
      torneio_id, time_casa_id, time_visitante_id, round,
      data_partida, local_partida, observacoes
    } = matchData;
    
    const sql = `
      INSERT INTO partidas (
        torneio_id, time_casa_id, time_visitante_id, round,
        data_partida, local_partida, observacoes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'agendada')
    `;
    
    const [result] = await pool.execute(sql, [
      torneio_id, time_casa_id, time_visitante_id, round,
      data_partida, local_partida, observacoes
    ]);
    
    return result.insertId;
  }

  static async findByTournament(torneioId) {
    const sql = `
      SELECT p.*, 
             tc.nome as time_casa_nome,
             tv.nome as time_visitante_nome,
             t.nome as torneio_nome
      FROM partidas p
      LEFT JOIN times tc ON p.time_casa_id = tc.id_equipe
      LEFT JOIN times tv ON p.time_visitante_id = tv.id_equipe
      LEFT JOIN torneios t ON p.torneio_id = t.id_torneio
      WHERE p.torneio_id = ?
      ORDER BY p.data_partida ASC
    `;
    
    const [rows] = await pool.execute(sql, [torneioId]);
    return rows;
  }

  static async findById(id) {
    const sql = `
      SELECT p.*, 
             tc.nome as time_casa_nome, tc.tag as time_casa_tag,
             tv.nome as time_visitante_nome, tv.tag as time_visitante_tag,
             t.nome as torneio_nome
      FROM partidas p
      LEFT JOIN times tc ON p.time_casa_id = tc.id_equipe
      LEFT JOIN times tv ON p.time_visitante_id = tv.id_equipe
      LEFT JOIN torneios t ON p.torneio_id = t.id_torneio
      WHERE p.id_partida = ?
    `;
    
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
  }

  static async updateScore(id, placar_casa, placar_visitante, vencedor_id = null) {
    const sql = `
      UPDATE partidas 
      SET placar_casa = ?, placar_visitante = ?, vencedor_id = ?,
          status = 'concluida'
      WHERE id_partida = ?
    `;
    
    const [result] = await pool.execute(sql, [placar_casa, placar_visitante, vencedor_id, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const sql = 'DELETE FROM partidas WHERE id_partida = ?';
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows > 0;
  }

  static async findByStatus(torneioId, status) {
    const sql = `
      SELECT p.*, 
             tc.nome as time_casa_nome,
             tv.nome as time_visitante_nome
      FROM partidas p
      LEFT JOIN times tc ON p.time_casa_id = tc.id_equipe
      LEFT JOIN times tv ON p.time_visitante_id = tv.id_equipe
      WHERE p.torneio_id = ? AND p.status = ?
      ORDER BY p.data_partida ASC
    `;
    
    const [rows] = await pool.execute(sql, [torneioId, status]);
    return rows;
  }
}

module.exports = Match;
