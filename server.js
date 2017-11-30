const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const checkParams = require('./checkParams');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      return response.status(200).json(projects);
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  database('palettes').where('projectId', request.params.id).select()
    .then(palettes => {
      if (palettes.length) {
        return response.status(200).json(palettes);
      } else {
        return response.status(404).json({
          error: `Could not find palettes from project with id of ${request.params.id}.`
        });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  checkParams(['title'], project, response);
  database('projects').insert(project, 'id')
    .then(project => {
      return response.status(201).json({ id: project[0] });
    })
    .catch( error => {
      return response.status(500).json({ error });
    });
});

app.post('/api/v1/projects/:id/palettes', (request, response) => {
  const palette = request.body;
  const paramsArray = ['name', 'color1', 'color2', 'color3', 'color4', 'color5', 'projectId'];
  checkParams(paramsArray, palette, response);

  database('palettes').insert(palette, 'id')
    .then(palette => {
      response.status(201).json({ id: palette[0] });
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});


app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;
  database('palettes').where('id', id).select()
    .then(palettes => {
      if (!palettes.length) {
        return response.status(422).json({
          error: `Could not find palettes with id of ${id}.`
        });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });

  database('palettes').where('id', id).del()
    .then(() => {
      return response.sendStatus(204);
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
