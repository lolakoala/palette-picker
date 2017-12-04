const randomColor = () => {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
};

const changeColor = () => {
  const colorsArray = [1, 2, 3, 4, 5];

  colorsArray.forEach(num => {
    $(`#color${num}`).css("background-color", randomColor());
  });
};

const addProject = title => {
  $('select').append(`<option value="${title}" >${title}</option>`);
};

const showProject = (id, title) => {
  $('.projects').append(`<div class='title' id='project${id}'><h4>${title}</h4></div>`);
};

const appendPalette = (id, name, colors, palId) => {
  const colorDivs = colors.map(color => {
    return `<div style='background-color:${color}' class='pal-color'></div>`;
  });
  $(`#project${id}`).append(`<div class='pal' id=${palId} >
    <div class='name-trash'>
      <h5>${name}</h5>
      <img src='../images/garbage.png' alt='delete' class='delete-pal' />
    </div>
    <div class='pal-colors'>
      ${colorDivs.join('')}
    </div>
  </div>`);
  $('.delete-pal').click(deletePalette);
};

const displayPalettes = (palettes, projectId) => {
  palettes.forEach(pal => {
    const colors = [pal.color1, pal.color2, pal.color3, pal.color4, pal.color5];
    appendPalette(projectId, pal.name, colors, pal.id);
  });
};

const getPalettes = projectId => {
  return fetch(`./api/v1/projects/${projectId}/palettes`)
    .then(res => res.json())
    .then(res => displayPalettes(res, projectId))
    .catch(error => { throw error; });
};

const displayProjects = projects => {
  projects.forEach(project => {
    showProject(project.id, project.title);
    addProject(project.title);
    getPalettes(project.id);
  });
};

const getProjects = () => {
  return fetch('./api/v1/projects')
    .then(res => res.json())
    .then(res => displayProjects(res))
    .catch(error => { throw error; });
};

function toggleLockImg(event) {
  const imgClass = event.target.className;

  if (imgClass === 'lock') {
    $(event.target).attr('src', '../images/lock.svg');
    $(event.target).attr('alt', 'This color is locked.');
    $(event.target).attr('class', 'locked');
  } else {
    $(event.target).attr('src', '../images/lock-open.svg');
    $(event.target).attr('alt', 'This color is unlocked.');
    $(event.target).attr('class', 'lock');
  }
}

function toggleLockId(event) {
  const { id } = event.target;

  if (id.includes('color')) {
    $(`#${id}`).children('img').attr('src', '../images/lock.svg');
    $(`#${id}`).children('img').attr('alt', 'This color is locked.');
    $(`#${id}`).children('img').attr('class', 'locked');
    $(`#${id}`).attr('id', `lock${id.substr(id.length - 1)}`);
  } else {
    $(`#${id}`).children('img').attr('src', '../images/lock-open.svg');
    $(`#${id}`).children('img').attr('alt', 'This color is unlocked.');
    $(`#${id}`).children('img').attr('class', 'lock');
    $(`#${id}`).attr('id', `color${id.substr(id.length - 1)}`);
  }
}

const handleAddProject = () => {
  const title = $('#new-title').val();
  fetch('./api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({ title }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(res => showProject(res.id, title))
    .catch(error => { throw error; });
  addProject(title);
};

const addPalette = projectId => {
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
    projectId
  };

  fetch(`./api/v1/projects/${projectId}/palettes`, {
    method: 'POST',
    body: JSON.stringify(palette),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
    .then(res => appendPalette(projectId, palette.name, hexArray, res.id))
    .catch(error => { throw error; });
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
    .then(res => res.id).then(res => addPalette(res))
    .catch(error => { throw error; });
};

function deletePalette() {
  const id = parseInt($(this).closest('.pal').attr('id'));
  fetch(`./api/v1/palettes/${id}`, {
    method: 'DELETE'
  }).catch(error => { throw error; });
  $(this).closest('.pal').remove();
}

$(window).load(() => {
  getProjects();
  changeColor();
});

$(".new").click(changeColor);

$(".color").click(event => toggleLockId(event));

$(".lock, .locked").click(event => toggleLockImg(event));
$('#add-project').click(handleAddProject);

$('.add-pal').click(handleAddPal);
