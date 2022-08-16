const { Router } = require('express');
const router = Router();
const {Temperament} = require("../db");


router.get('/', async (req, res) => {
    try {
        const temperaments = await Temperament.findAll({})
        res.json(temperaments)
    } catch (error) {
        console.log(error, "temperament falla")
        res.sendStatus(500)
        
    }
})

module.exports = router;