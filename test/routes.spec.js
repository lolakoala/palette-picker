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

describe('API Routes', (done) => {
  before((done) => {
    knex.migrate.latest()
      .then(() => done())
      .catch(error => { throw error; });
  });

  beforeEach((done) => {
    knex.seed.run()
      .then(() => done())
      .catch(error => { throw error; });
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
        .catch(error => { throw error; });
    });
  });

  describe('GET /api/v1/projects/:id/palettes', () => {
    it('should return an array of palettes with projectId 1', () => {
      return chai.request(server)
        .get('/api/v1/projects/1/palettes')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(4);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('summer');
          response.body[0].should.have.property('color1');
          response.body[0].color1.should.equal('#a3a380');
          response.body[0].should.have.property('color2');
          response.body[0].color2.should.equal('#d6ce93');
          response.body[0].should.have.property('color3');
          response.body[0].color3.should.equal('#efebce');
          response.body[0].should.have.property('color4');
          response.body[0].color4.should.equal('#d8a48f');
          response.body[0].should.have.property('color5');
          response.body[0].color5.should.equal('#bb8588');
          response.body[0].should.have.property('projectId');
          response.body[0].projectId.should.equal(1);

        })
        .catch(error => { throw error; });

    });

    it('should return 404 if there is project does not exists or has no palettes', () => {
      return chai.request(server)
        .get('/api/v1/projects/10000/palettes')
        .then(response => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('Could not find palettes from project with id of 10000.');
        });
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should return the project id', () => {
      return chai.request(server)
        .post('/api/v1/projects')
        .send({
          id: 4,
          title: 'paintings'
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(4);
        })
        .catch(error => { throw error; });
    });

    it('should return 422 if no title property', () => {
      return chai.request(server)
        .post('/api/v1/projects')
        .send({
          id: 5
        })
        .then(response => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('You are missing the title property.');
        })
        .catch(error => { throw error; });
    });

    it('should return 422 if title already exists', () => {
      return chai.request(server)
        .post('/api/v1/projects')
        .send({
          id: 5,
          title: 'seasons'
        })
        .then(response => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('A project with that title already exists.');
        })
        .catch(error => { throw error; });
    });
  });

  describe('POST /api/v1/projects/:id/palettes', () => {
    it('should return id if success', () => {
      return chai.request(server)
        .post('/api/v1/projects/1/palettes')
        .send({
          id: 12,
          name: 'notsummer',
          color1: '#040403',
          color2: '#363946',
          color3: '#4f6367',
          color4: '#a6b3bf',
          color5: '#c32534',
          projectId: 1
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(12);
        })
        .catch(error => { throw error; });
    });

    it('should return 422 if no params', () => {
      return chai.request(server)
        .post('/api/v1/projects/1/palettes')
        .send({
          id: 12,
          name: 'notsummer',
          color2: '#363946',
          color3: '#4f6367',
          color4: '#a6b3bf',
          color5: '#c32534',
          projectId: 1
        })
        .then(response => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('You are missing the color1 property.');
        })
        .catch(error => { throw error; });
    });
  });

  describe('DELETE /api/v1/palettes/:id', () => {
    it('should return 204 if success', () => {
      return chai.request(server)
        .del('/api/v1/palettes/1')
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => { throw error; });
    });

    it('should return 422 if palette does not exist', () => {
      return chai.request(server)
        .del('/api/v1/palettes/10000')
        .then(response => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('Could not find palettes with id of 10000.');
        })
        .catch(error => { throw error; });
    });
  });

});
