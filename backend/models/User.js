const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { nome, apelido, email, senha, bio = '', conquistas = '' } = userData;
    
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);
    
    const sql = `
      INSERT INTO usuarios (nome, apelido, email, senha, bio, conquistas, data_criacao) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const [result] = await pool.execute(sql, [nome, apelido, email, senhaHash, bio, conquistas]);
    return result.insertId;
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    const [rows] = await pool.execute(sql, [email]);
    return rows[0];
  }

  static async findById(id) {
    const sql = 'SELECT id_usuario, nome, apelido, email, bio, conquistas, foto_perfil, data_criacao FROM usuarios WHERE id_usuario = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
  }

  static async update(id, userData) {
    const { nome, apelido, bio, conquistas, foto_perfil } = userData;
    
    const sql = `
      UPDATE usuarios 
      SET nome = ?, apelido = ?, bio = ?, conquistas = ?, foto_perfil = ?
      WHERE id_usuario = ?
    `;
    
    const [result] = await pool.execute(sql, [nome, apelido, bio, conquistas, foto_perfil, id]);
    return result.affectedRows > 0;
  }

  static async updatePassword(id, novaSenha) {
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(novaSenha, saltRounds);
    
    const sql = 'UPDATE usuarios SET senha = ? WHERE id_usuario = ?';
    const [result] = await pool.execute(sql, [senhaHash, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const sql = 'DELETE FROM usuarios WHERE id_usuario = ?';
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows > 0;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;