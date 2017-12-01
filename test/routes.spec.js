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

  beforeEach((done) => {
    knex.seed.run();
    done();
  });

  describe('GET /api/v1/projects', () => {
    it('should return all of the projects', () => {
      return chai.request(server)
        .get('/api/v1/projects')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body[0].should.have.property('title');
          response.body[0].title.should.equal('seasons');
        })
        .catch(error => throw error);
    });
  });
  describe('GET /api/v1/projects/1/palettes', () => {
    it('should return an array of palettes with projectId 1', () => {
      return chai.request(server)
        .get('/api/v1/projects/1/palettes')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(11);
          response.body[0].should.have.property('name');
          response.body[0].title.should.equal('summer');
          response.body[0].should.have.property('color1');
          response.body[0].color1.should.equal('#a3a380');
          response.body[0].should.have.property('color2');
          response.body[0].color2.should.equal('#d6ce93');
          response.body[0].should.have.property('color3');
          response.body[0].color2.should.equal('#efebce');
          response.body[0].should.have.property('color4');
          response.body[0].color2.should.equal('#d8a48f');
          response.body[0].should.have.property('color5');
          response.body[0].color2.should.equal('#bb8588');
          response.body[0].should.have.property('projectId');
          response.body[0].projectId.should.equal(1);
        })
        .catch(error => throw error);

    });
  });

});
