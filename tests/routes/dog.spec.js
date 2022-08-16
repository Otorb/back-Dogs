/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Dog, conn } = require('../../src/db.js');

const agent = session(app);
const dog = {
  name: 'Pug',
};

// describe('Videogame routes', () => {
//   before(() => conn.authenticate()
//   .catch((err) => {
//     console.error('Unable to connect to the database:', err);
//   }));
//   beforeEach(() => Dog.sync({ force: true })
//     .then(() => Dog.create(dog)));
//   describe('GET /dogs', () => {
//     it('should get 200', () =>
//       agent.get('/dogs').expect(200)
//     );
//   });
// });

describe('GET /temperament', () => {
  it('expecting 200 as response', () => 
    agent.get('/temperaments').expect(200)
  );
});

describe('GET /dogs', () => {
  it('expecting 200 as response', () =>
    agent.get('/dogs').expect(200)
  );
});
describe('GET /dogs/:id', () => {
  it('expecting 200 when the id exists', () => 
    agent.get('/dogs/1').expect(200)
  );
});
