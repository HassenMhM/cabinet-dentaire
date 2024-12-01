const pool = require('../config/database');

exports.getAllProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM stock');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addProduct = async (req, res) => {
    const { product_name, quantity, expiration_date, supplier_id, alert_threshold } = req.body;
    try {
        const query = `
            INSERT INTO stock (product_name, quantity, expiration_date, supplier_id, alert_threshold)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [product_name, quantity, expiration_date, supplier_id, alert_threshold];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM stock WHERE id = $1';
        await pool.query(query, [id]);
        res.status(200).json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
