const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { pool } = require('../config/database');
    const sql = 'SELECT * FROM times ORDER BY nome ASC';
    const [rows] = await pool.execute(sql);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Erro ao buscar times:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;