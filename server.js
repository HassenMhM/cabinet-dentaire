const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const stockRoutes = require('./routes/stockRoutes');
const userRoutes = require('./routes/userRoutes');
const prothesesRoutes = require('./routes/prothesesRoutes')
const eventsRoutes = require('./routes/eventsRoutes')
const supplierRoutes = require('./routes/supplierRoutes')
const patientRoutes=require('./routes/patientsRoutes')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/stock', stockRoutes);
app.use('/api/users',userRoutes)
app.use('/api/protheses',prothesesRoutes)
app.use('/api/events',eventsRoutes)
app.use('/api/suppliers',supplierRoutes)
app.use('/api/patients',patientRoutes)

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
