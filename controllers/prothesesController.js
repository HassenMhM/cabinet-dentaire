const pool = require('../config/database');


exports.getAllProtheses = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM protheses ORDER BY id');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProthesisById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM protheses WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Prothesis not found' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addProthesis = async (req, res) => {
    const { name, type, cost, payment_status, supplier_id } = req.body;
    try {
        const query = `
            INSERT INTO protheses (name, type, cost, payment_status, supplier_id) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [name, type, cost, payment_status, supplier_id];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProthesis = async (req, res) => {
    const { id } = req.params;
    const { name, type, cost, payment_status, supplier_id } = req.body;
    try {
        const query = `
            UPDATE protheses 
            SET name = $1, type = $2, cost = $3, payment_status = $4, supplier_id = $5 
            WHERE id = $6 RETURNING *`;
        const values = [name, type, cost, payment_status, supplier_id, id];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Prothesis not found' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProthesis = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM protheses WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Prothesis not found' });
        res.status(200).json({ message: 'Prothesis deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
