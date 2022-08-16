const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const DogRoute = require('./Dog');
const TemperRoute = require('./Temperaments2');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/dogs', DogRoute);
router.use('/temperaments', TemperRoute);

module.exports = router;
