//pulls in express
const express = require('express');
//pulls in body-parser
const bodyParser = require('body-parser');
//makes a new instance of app by calling express
const app = express();
//sets environment to development by default
const environment = process.env.NODE_ENV || 'development';
//pulls in knexfile, sets configuration to knex at environment
const configuration = require('./knexfile')[environment];
//connects to database for that environment
const database = require('knex')(configuration);
//pulls in helper function
const checkParams = require('./checkParams');

//sets body-parser as middleware
app.use(bodyParser.json());
//sets body-parser as middleware
app.use(bodyParser.urlencoded({ extended: true }));
//sets static content
app.use(express.static(__dirname + '/public'));
//sets default port to 3000
app.set('port', process.env.PORT || 3000);

//get request for projects endpoint
app.get('/api/v1/projects', (request, response) => {
  //selects projects table
  database('projects').select()
  //response is array of projects
    .then(projects => {
      //returns success status code and array of projects
      return response.status(200).json(projects);
    })
    //if there is error
    .catch(error => {
      //send server error status code with error in body
      return response.status(500).json({ error });
    });
});

//get request for palettes belonging to specific project
app.get('/api/v1/projects/:id/palettes', (request, response) => {
  //get palettes that match projectId
  database('palettes').where('projectId', request.params.id).select()
  //return an array of palettes
    .then(palettes => {
      //if array has contents
      if (palettes.length) {
        //send success status and array of palettes
        return response.status(200).json(palettes);
        //if array has no contents
      } else {
        //return not found status
        return response.status(404).json({
          //with error msg in body
          error: `Could not find palettes from project with id of ${request.params.id}.`
        });
      }
    })
    //if there is error
    .catch(error => {
      //send server error status code with error in body
      return response.status(500).json({ error });
    });
});

//post request to add project
app.post('/api/v1/projects', (request, response) => {
  //get project out of response body
  const project = request.body;
  //helper function checks if body has required parameters
  checkParams(['title'], project, response);
  //get projects that match title
  database('projects').where('title', project.title).select()
  //returns array of projects
    .then(projects => {
      //if array has content (if title already exists)
      if (projects.length) {
        //send user error status
        return response.status(422).json({
          //with error message
          error: 'A project with that title already exists.'
        });
      }

    })
    //if title doesn't exist
    .then(() => {
      //insert new project into table
      database('projects').insert(project, 'id')
      //returns response in array
        .then(project => {
          //send success status and project id
          return response.status(201).json({ id: project[0] });
        })
        //if there is error
        .catch(error => {
          //send server error status code with error in body
          return response.status(500).json({ error });
        });
    })
    //if there is error
    .catch(error => {
      //send server error status code with error in body
      return response.status(500).json({ error });
    });
});

//post request to add palette
app.post('/api/v1/projects/:id/palettes', (request, response) => {
  //get palette from body
  const palette = request.body;
  //set array of required parameters
  const paramsArray = ['name', 'color1', 'color2', 'color3', 'color4', 'color5', 'projectId'];
  //helper function checks required parameters
  checkParams(paramsArray, palette, response);
  //insert palette if it passes check
  database('palettes').insert(palette, 'id')
  //returns response in array
    .then(palette => {
      //send success status with palette id
      response.status(201).json({ id: palette[0] });
    })
    //if there is error
    .catch(error => {
      //send server error status code with error in body
      return response.status(500).json({ error });
    });
});

//request to delete palette
app.delete('/api/v1/palettes/:id', (request, response) => {
  //get id from params
  const { id } = request.params;
  //find palette that matches id
  database('palettes').where('id', id).select()
  //returns array of responses
    .then(palettes => {
      //if nothing matches
      if (!palettes.length) {
        //send user error status
        return response.status(422).json({
          //with error message
          error: `Could not find palettes with id of ${id}.`
        });
      }
    })
    //if there is error
    .catch(error => {
      //send server error status code with error in body
      return response.status(500).json({ error });
    });
//find palette that matches id
  database('palettes').where('id', id).del()
    .then(() => {
      //send successful delete status
      return response.sendStatus(204);
    })

    //if there is error
    .catch(error => {
      //send server error status code with error in body
      return response.status(500).json({ error });
    });
});

//server listen for stuff at the port (turn it on!)
app.listen(app.get('port'), () => {
  //let me know you're running
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

//export for testing
module.exports = app;
