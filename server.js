const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const checkParams = require('./checkParams');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//where my static assets live
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);

app.locals.title = 'Palette Picker';
app.locals.projects = [
  { id: 1, title: 'seasons' },
  { id: 2, title: 'pets' },
  { id: 3, title: 'elements' }
];
app.locals.palettes = [
  {
    id: 1,
    name: 'summer',
    color1: '#a3a380',
    color2: '#d6ce93',
    color3: '#efebce',
    color4: '#d8a48f',
    color5: '#bb8588',
    projectId: 1
  },
  {
    id: 2,
    name: 'spring',
    color1: '#ee6055',
    color2: '#60d394',
    color3: '#aaf683',
    color4: '#ffd97d',
    color5: '#ff9b85',
    projectId: 1
  },
  {
    id: 3,
    name: 'winter',
    color1: '#d1bce3',
    color2: '#c49bbb',
    color3: '#a1867f',
    color4: '#585481',
    color5: '#19297c',
    projectId: 1
  },
  {
    id: 4,
    name: 'fall',
    color1: '#e06c9f',
    color2: '#f283b6',
    color3: '#edbfb7',
    color4: '#b5bfa1',
    color5: '#6e9887',
    projectId: 1
  },
  {
    id: 5,
    name: 'ralphie',
    color1: '#0d160b',
    color2: '#785589',
    color3: '#977390',
    color4: '#ac7b7d',
    color5: '#bb8a89',
    projectId: 2
  },
  {
    id: 6,
    name: 'schweetz',
    color1: '#550527',
    color2: '#688e26',
    color3: '#faa613',
    color4: '#f44708',
    color5: '#a10702',
    projectId: 2
  },
  {
    id: 7,
    name: 'totoro',
    color1: '#cad178',
    color2: '#d3d57c',
    color3: '#c7aa74',
    color4: '#957964',
    color5: '#603140',
    projectId: 2
  },
  {
    id: 8,
    name: 'water',
    color1: '#9dd9d2',
    color2: '#79bcb8',
    color3: '#5ec2b7',
    color4: '#2ca6a4',
    color5: '#3aa7a3',
    projectId: 3
  },
  {
    id: 9,
    name: 'earth',
    color1: '#33658a',
    color2: '#86bbd8',
    color3: '#758e4f',
    color4: '#f6ae2d',
    color5: '#f26419',
    projectId: 3
  },
  {
    id: 10,
    name: 'air',
    color1: '#f7fff7',
    color2: '#343434',
    color3: '#2f3061',
    color4: '#ffe66d',
    color5: '#6ca6c1',
    projectId: 3
  },
  {
    id: 11,
    name: 'fire',
    color1: '#6f1d1b',
    color2: '#bb9457',
    color3: '#432818',
    color4: '#99582a',
    color5: '#ffe6a7',
    projectId: 3
  }
];

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
  const { palette } = request.body;
  const id = app.locals.palettes.length + 1;
  const newPalette = Object.assign({ id }, palette);

  if (palette) {
    app.locals.palettes.push(newPalette);
    return response.status(201).json(newPalette);
  } else {
    return response.status(422).send({
      error: 'No palette property provided.'
    });
  }
});


app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;
  const palette = app.locals.palettes.find(palette => palette.id === id);

  if (!palette) {
    return response.status(422).send({
      error: 'No palette matches that id.'
    });
  } else {
    const paletteIndex = app.locals.palettes.findIndex(palette => palette.id === id);

    app.locals.palettes.splice(paletteIndex, 1);
    return response.sendStatus(204);
  }
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
