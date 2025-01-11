const express=require('express')
const router=express.Router()
const {getAllPatients,getPatientById,newPatient,deletePatient}=require('../controllers/patientsController')

router.get('/',getAllPatients)
router.get('/:id',getPatientById)
router.post('/',newPatient)
router.delete('/:id',deletePatient)

module.exports=router