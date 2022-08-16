const { Router } = require("express");
// Importar todos los routers;
const axios = require("axios");
const sequelize = require("sequelize");
const { Op, GEOGRAPHY } = require("sequelize");
const { APIKEY } = process.env;
// Ejemplo: const authRouter = require('./auth.js');
const { Dog, Temperament } = require("../db");
const apiUrl = `https://api.thedogapi.com/v1/breeds?api_key=${APIKEY}`;

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

//api

const DogsApi = async () => {
  const ApiInfo = await axios.get(apiUrl);

  const dogsComplete = [];

  for (let i = 0; i < ApiInfo.data.length; i++) {
    var dog = ApiInfo.data[i];

    if (dog.weight.metric === 'NaN') {
        let impWeight = dog.weight.imperial.split(" ");
        let metWeight = [Math.round(0.45 * Number(impWeight[0])), Math.round(0.45 * Number(impWeight[2])),
        ];
        dog.weight.metric = metWeight.join(" - ");
      }

    if (dog.height.metric === 'NaN') {
      let impHeight = dog.height.imperial.split(" ");
      let metHeight = [
        Math.round(0.45 * Number(impHeight[0])),
        Math.round(0.45 * Number(impHeight[2])),
      ];
      dog.height.metric = metHeight.join(" - ");
    }



    const DetailModels = {
      id: dog.id,
      image: dog.image.url,
      name: dog.name.toLowerCase(),
      height: dog.height.metric,
      weight: dog.weight.metric,
      life: dog.life_span,
      temperament: dog.temperament,
    };
    dogsComplete.push(DetailModels);
  }
  return dogsComplete;
};



//Database

const dataBaseDog = async () => {
  const baseDog = await Dog.findAll({
    include: {
      model: Temperament,
    }
  })

  const dogComplete = [];

  if (baseDog.length > 0) {
    for (var i = 0; i < baseDog.length; i++){
      const dogsDb = baseDog[i]
       var stringTemperament = '';

  if(dogsDb.temperaments.length > 0){
    for (var j = 0; j < dogsDb.temperaments.length; j++){
      const temperamentDog = dogsDb.temperaments[j].name
      stringTemperament += temperamentDog + ', '
    }
    stringTemperament = stringTemperament.substring(0, stringTemperament.length - 2);
  
  }




  const dBDetail = {
            id: dogsDb.id,
            name : dogsDb.name.toLowerCase(),
            height: dogsDb.height,
            weight: dogsDb.weight,
            life: dogsDb.life,
            createInDb: dogsDb.createInDb,
            temperament: stringTemperament,
            image: dogsDb.image
        }
        dogComplete.push(dBDetail)
        console.log(stringTemperament, "no tiene nada")
    }
  }

  return dogComplete

}



 


//concatenacion api y Db

const getAll = async () => {
    const apiDog = await DogsApi()
    const baseDog = await dataBaseDog()

    const getDogs = baseDog.concat(apiDog)

    return getDogs
}


//get Id

router.get('/:id', async (req, res) =>{
    const id = req.params.id;
    try {
        if (id.length > 3){
            const dbDogReady = await dataBaseDog()

            const dogId = dbDogReady.find(dog => dog.id === id)
            if(!dogId){
                return res.status(404).send({info: "I'm sorry I can't to find it"})
            }
            return res.send(dogId)
        }
        if (!isNaN(id)){
            const apiDbReady = await DogsApi()
            const dogsId = apiDbReady.find(dog => dog.id == id)

            if(!dogsId){
                return res.status(404).send({info: "I'm sorry I can't to find it"})
            }
            return res.send(dogsId)
        }
        res.status(404).send({info: "Is correct yor Id"})

    } catch (error) {
        console.log(error, 'problemas en el Id')
    }
})

// get Name

router.get('/', async (req, res) =>{
  const name  = req.query.name
	

    try {
        const dogs = await getAll()

        if (name) {
            const dogsName = dogs.filter(dog => dog.name.toLowerCase().includes(name.toLowerCase()))

            if(!dogsName.length){
                return res.status(404).send({info: "I'm sorry I can't to find it"})
            }
            return res.send(dogsName)
        }
        res.json(dogs)
        
    } catch (error) {
        console.log(error, "falla el nombre")
    }
})


//post

router.post('/', async (req, res) => {
    const { name, height, weight, life, temperament, image } = req.body

    try {
        const dogCreate = await Dog.create({  
            name  ,
            height, 
            weight, 
            life, 
            image,
        })

        temperament.forEach(async function (t) {
            var temperametBd = await Temperament.findOne({
              where:{
                name:  t 
              }
            })
            dogCreate.addTemperament(temperametBd)
        })

        return res.json(dogCreate)

    } catch (error) {
        console.log(error, "falla el post")
    }
})

  //put
  let favorites =[]
const STATUS_USER_ERROR = 422;

router.put('/', (req, res) => {
  const { id, name } = req.body
  if(!id || !name)
  return res.status(STATUS_USER_ERROR).json({ 
    error : "No se recibieron los parámetros necesarios para hacer el Put"
  })

  const favorites = favorites.find(favorites => favorites.id === id)
  if(!favorites) return res.status(STATUS_USER_ERROR).json({error: "No se encontro el Post"})
  favorites.name = name
  res.json(post)

})








module.exports = router;
