const pool = require('../config/database');

exports.getAllSuppliers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM suppliers ORDER BY id');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getSupplierById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM suppliers WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Supplier not found' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addSupplier = async (req, res) => {
    const { name, contact_info } = req.body;
    try {
        const query = `
            INSERT INTO suppliers (name, contact_info)
            VALUES ($1, $2) RETURNING *`;
        const values = [name, contact_info];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateSupplierInfo = async (req, res) => {
    const { id } = req.params;
    const { name, contact_info } = req.body;
    try {
        const query = `
            UPDATE suppliers 
            SET name = $1, contact_info = $2 
            WHERE id = $3 RETURNING *`;
        const values = [name, contact_info, id];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Supplier not found' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM suppliers WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Supplier not found' });
        res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
