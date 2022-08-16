const axios = require("axios");
const { APIKEY } = process.env;
const { Temperament } = require("../db");
const apiUrl = `https://api.thedogapi.com/v1/breeds?api_key=${APIKEY}}`;

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const temperamentApi = async () => {
  
  try {
    const dog = await axios.get(apiUrl);

    let temperament = [];

    for (let i = 0; i < dog.data.length; i++) {
      const temperamentDog = dog.data[i]?.temperament;
      if (temperamentDog) {
        temperament = temperament.concat(temperamentDog.split(", "));
      }
    }

    const temperaturaTotal = [...new Set(temperament)]

    temperaturaTotal.map(el =>{
        Temperament.findOrCreate({ 
            where: {
                name: el
            }
        })
    })



  } catch (error) {
    console.log(error, "fallan los temperamentos de la api");
  }
};



module.exports = temperamentApi;
