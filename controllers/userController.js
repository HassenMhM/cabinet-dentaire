const pool = require('../config/database');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users;');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req,res) => {
    const {id}=req.params
    try {
        const result= await pool.query(`SELECT id,username,email,role_id From users WHERE id=$1;`,[id])
        if(result.rows.length===0) return res.status(404).json({message: 'User not found'})
        res.status(200).json(result.rows[0])
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}
exports.getUserByRoleId = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    try {
        const result = await pool.query('SELECT * FROM users WHERE role_id = $1', [id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.register = async (req, res) => {
    try {
        const { username, email, password, role_id } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO users (username, email, password, role_id)
            VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [username, email, hashedPassword, role_id];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req,res) => {
    try {
        const {email,password}=req.body
        const userQuery = `SELECT * FROM users WHERE email=$1`
        const userResult=await pool.query(userQuery,[email])
        const user=userResult.rows[0]
        if(!user) return res.status(404).json({message: 'User not found'})
        const isPasswordValid=await bcrypt.compare(password,user.password)
        if(!isPasswordValid) return res.status(401).json({message: 'Invalid password'})
        const token=jwt.sign({id:user.id,role:user.role_id},process.env.JWT_SECRET,{expiresIn:'1d'})
        res.status(200).json({ message: 'Login successful', token ,role_id:user.role_id});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateUserInfo = async (req,res) => {
    const { id } = req.params;
    const { username, email } = req.body;
    try {
        const query = `
            UPDATE users 
            SET username = $1, email = $2 
            WHERE id = $3 RETURNING id, username, email;`;
        const values = [username, email, id];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.assignRole = async (req, res) => {
    const { id } = req.params;
    const { role_id } = req.body;
    try {
        const query = `
            UPDATE users 
            SET role_id = $1 
            WHERE id = $2 RETURNING id, username, email, role_id`;
        const result = await pool.query(query, [role_id, id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    const { email } = req.params;
    const { oldPassword, newPassword } = req.body;
    try {
        const userQuery = 'SELECT password FROM users WHERE email = $1';
        const userResult = await pool.query(userQuery, [email]);
        const user = userResult.rows[0];
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid old password' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = `
            UPDATE users 
            SET password = $1 
            WHERE email = $2 RETURNING id, username, email`;
        const result = await pool.query(updateQuery, [hashedPassword, email]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
