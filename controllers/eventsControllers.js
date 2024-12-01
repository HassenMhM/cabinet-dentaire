const pool = require('../config/database');

exports.getAllEvents = async (req, res) => {
    const { doctor_id, start_date, end_date } = req.query;
    try {
        let query = 'SELECT * FROM events WHERE 1=1';
        const params = [];
        if (doctor_id) {
            query += ' AND doctor_id = $' + (params.length + 1);
            params.push(doctor_id);
        }
        if (start_date && end_date) {
            query += ' AND start_time BETWEEN $' + (params.length + 1) + ' AND $' + (params.length + 2);
            params.push(start_date, end_date);
        }
        const result = await pool.query(query, params);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addEvent = async (req, res) => {
    const { title, description, start_time, end_time, doctor_id } = req.body;
    try {
        const query = `
            INSERT INTO events (title, description, start_time, end_time, doctor_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [title, description, start_time, end_time, doctor_id];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, start_time, end_time, doctor_id } = req.body;
    try {
        const query = `
            UPDATE events 
            SET title = $1, description = $2, start_time = $3, end_time = $4, doctor_id = $5, updated_at = CURRENT_TIMESTAMP
            WHERE id = $6 RETURNING *`;
        const values = [title, description, start_time, end_time, doctor_id, id];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
