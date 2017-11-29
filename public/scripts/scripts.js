const randomColor = () => {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
};

const changeColor = () => {
  const colorsArray = [1, 2, 3, 4, 5];

  colorsArray.forEach(num => {
    $(`#color${num}`).css("background-color", randomColor())
  });
};

const addProject = title => {
  $('select').append(`<option value="${title}" >${title}</option>`);
};

const showProject = (id, title) => {
  $('.projects').append(`<div class='title' id='project${id}'><h4>${title}</h4></div>`);
};

const appendPalette = (id, name, colors) => {
  const colorDivs = colors.map(color => {
    return `<div style='background-color:${color}' class='pal-color'></div>`;
  });
  $(`#project${id}`).append(`<div class='pal'>
    <h5>${name}</h5>
    ${colorDivs.join('')}
    <img src='https://d30y9cdsu7xlg0.cloudfront.net/png/446206-200.png' alt='delete' class='delete-pal'/>
  </div>`);
};

const displayPalettes = (palettes, projects) => {
  projects.forEach(project => {
    const projectPals = palettes.filter(palette => palette.projectId === project.id);
    projectPals.forEach(pal => {
      const colors = [pal.color1, pal.color2, pal.color3, pal.color4, pal.color5];
      appendPalette(project.id, pal.name, colors);
    });
  });
};

const getPalettes = projects => {
  return fetch('./api/v1/palettes').then(res => res.json()).then(res => displayPalettes(res, projects));
};

const displayProjects = projects => {
  projects.forEach(project => {
    showProject(project.id, project.title);
    addProject(project.title);
  });
  getPalettes(projects);
};

const getProjects = () => {
  return fetch('./api/v1/projects').then(res => res.json()).then(res => displayProjects(res));
};

const toggleLockId = event => {
  const { id } = event.target;

  if (id.includes('color')) {
    $(`#${id}`).attr('id', `lock${id.substr(id.length - 1)}`);
  } else {
    $(`#${id}`).attr('id', `color${id.substr(id.length - 1)}`);
  }
};

const handleAddProject = () => {
  const title = $('#new-title').val();
  //add to DB and dom
  fetch('./api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({ title }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(res => showProject(res.id, res.title));
  //add to drop down
  addProject(title);
};

const addPalette = id => {
  const colorsArray = ['color1', 'color2', 'color3', 'color4', 'color5'];
  const hexArray = colorsArray.map(color => {
    return rgba2hex($(`.${color}`).css('background-color'));
  });
  const palette = {
    name: $('#new-palette').val(),
    color1: hexArray[0],
    color2: hexArray[1],
    color3: hexArray[2],
    color4: hexArray[3],
    color5: hexArray[4],
    projectId: id
  };

  fetch('./api/v1/palettes', {
    method: 'POST',
    body: JSON.stringify({ palette }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
    .then(res => appendPalette(id, res.name, hexArray));
};

const rgba2hex = ( color ) => {
  if ( ! color ) return false;
  var parts = color.toLowerCase().match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/),
    length = color.indexOf('rgba') ? 3 : 2;
  delete(parts[0]);
  for ( let iter = 1; iter <= length; iter++ ) {
    parts[iter] = parseInt( parts[iter] ).toString(16);
    if ( parts[iter].length === 1 ) parts[iter] = '0' + parts[iter];
  }
  return '#' + parts.join('').toUpperCase();
};


const handleAddPal = () => {
  fetch('./api/v1/projects')
    .then(res => res.json())
    .then(res => res.find(project => project.title === $('select').val()))
    .then(res => res.id).then(res => addPalette(res));
};

$(window).load(() => {
  getProjects();
  changeColor();
});

$(".new").click(changeColor);

$(".color").click(event => toggleLockId(event));

$('#add-project').click(handleAddProject);

$('.add-pal').click(handleAddPal)
