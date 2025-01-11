const pool = require('../config/database')

exports.getAllPatients=async (req,res)=>{
    try{
        const result =await pool.query('SELECT * FROM patients;')
        res.status(200).json(result.rows)
    } catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.getPatientById =async (req,res)=>{
    const {id}=req.params
    try{
        const result = await pool.query(`SELECT id,name,surname,phone_number,email From patients WHERE id=$1;`,[id])
        if(result.rows.length===0) return res.status(404).json({message:'Pastient not found'})
        res.status(200).json(result.rows[0])
    } catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.newPatient= async (req,res)=>{
    try{
        const {name,surname,phone_number,email}=req.body
        const query=`INSERT INTO patients (name,surname,phone_number,email) VALUES ($1,$2,$3,$4) RETURNING *`
        const values=[name,surname,phone_number,email]
        const result=await pool.query(query,values)
        res.status(201).json(result.rows[0])
    }catch (err){
        res.status(500).json({error: err.message})
    }
}

exports.deletePatient= async (req,res)=>{
    const {id}=req.params
    try{
        const query='DELETE FROM patients WHERE id=$1 RETURNING id'
        if(result.rows.length===0)return res.status(404).json({message: 'patient not found'})
            res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}