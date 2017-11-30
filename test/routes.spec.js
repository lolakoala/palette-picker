const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const knex = require('knex')(configuration);

chai.use(chaiHttp);


describe('Client Routes', () => {

  it('should return the homepage with text', () => {
    console.log(environment)
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(error => {
        throw (error);
      });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/sad')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(error => {
        throw (error);
      });
  });
});

describe('API Routes', () => {
  before(() => {
    knex.migrate.latest();
  });

  beforeEach(() => {
    knex.seed.run();
  });

  // describe('GET /api/v1/students', () => {
  //   it('should return all of the students', () => {
  //     return chai.request(server)
  //     .get('/api/v1/students')
  //     .then(response => {
  //       response.should.have.status(200);
  //       response.should.be.json;
  //       response.body.should.be.a('array');
  //       response.body.length.should.equal(3);
  //       response.body[0].should.have.property('lastname');
  //       response.body[0].lastname.should.equal('Turing');
  //       response.body[0].should.have.property('program');
  //       response.body[0].program.should.equal('FE');
  //       response.body[0].should.have.property('enrolled');
  //       response.body[0].enrolled.should.equal(true);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  //   });
  // });

  describe('GET /api/v1/projects', () => {
    it('should return all of the projects', () => {
      return chai.request(server)
        .get('/api/v1/projects')
        .then(response => {
          response.should.have.status(200);
        })
        .catch(error => console.log(error));
    })
  })

});
