const { pool } = require('../config/database');

class Tournament {
  static async create(tournamentData) {
    const {
      id_usuario_criador, nome, descricao, jogo, formato,
      data_inicio, data_fim, premio, max_equipes = 16
    } = tournamentData;
    
    const sql = `
      INSERT INTO torneios (
        id_usuario_criador, nome, descricao, jogo, formato, 
        data_inicio, data_fim, premio, max_equipes, criado_em
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const [result] = await pool.execute(sql, [
      id_usuario_criador, nome, descricao, jogo, formato,
      data_inicio, data_fim, premio, max_equipes
    ]);

    return result.insertId;
  }

  static async findAll() {
    const sql = `
      SELECT t.*, u.nome as criador_nome, u.apelido as criador_apelido,
             COUNT(et.id_equipe) as total_equipes
      FROM torneios t
      LEFT JOIN usuarios u ON t.id_usuario_criador = u.id_usuario
      LEFT JOIN equipe_torneio et ON t.id_torneio = et.id_torneio
      GROUP BY t.id_torneio
      ORDER BY t.criado_em DESC
    `;
    
    const [rows] = await pool.execute(sql);
    return rows;
  }

  static async findById(id) {
    const sql = `
      SELECT t.*, u.nome as criador_nome, u.apelido as criador_apelido
      FROM torneios t
      LEFT JOIN usuarios u ON t.id_usuario_criador = u.id_usuario
      WHERE t.id_torneio = ?
    `;
    
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
  }

  static async update(id, tournamentData) {
    const {
      nome, descricao, jogo, formato, status,
      data_inicio, data_fim, premio, max_equipes
    } = tournamentData;
    
    const sql = `
      UPDATE torneios 
      SET nome = ?, descricao = ?, jogo = ?, formato = ?, status = ?,
          data_inicio = ?, data_fim = ?, premio = ?, max_equipes = ?
      WHERE id_torneio = ?
    `;
    
    const [result] = await pool.execute(sql, [
      nome, descricao, jogo, formato, status,
      data_inicio, data_fim, premio, max_equipes, id
    ]);

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const sql = 'DELETE FROM torneios WHERE id_torneio = ?';
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Tournament;