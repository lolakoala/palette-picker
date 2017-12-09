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

const getOfflinePalettes = id => {
  loadOfflinePalettes()
    .then(palettes => {
      const matchingPalettes = palettes.filter(palette => palette.projectId === id);
      displayPalettes(matchingPalettes, id);
    })
    .catch(error => { throw error; });
};

const getPalettes = projectId => {
  return fetch(`./api/v1/projects/${projectId}/palettes`)
    .then(res => res.json())
    .then(res => displayPalettes(res, projectId))
    .catch(error => {
      throw error;
    });
};

const displayProjects = projects => {
  projects.forEach(project => {
    showProject(project.id, project.title);
    addProject(project.title);
    getPalettes(project.id);
  });
};

const displayOfflineProjects = projects => {
  projects.forEach(project => {
    showProject(project.id, project.title);
    addProject(project.title);
    getOfflinePalettes(project.id);
  });
};

const getOfflineProjects = () => {
  loadOfflineProjects()
    .then(projects => displayOfflineProjects(projects))
    .catch(error => { throw error; });
};

const getProjects = () => {
  return fetch('./api/v1/projects')
    .then(res => res.json())
    .then(res => displayProjects(res))
    .catch(error => {
      getOfflineProjects();
      throw error;
    });
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
  const id = Date.now();
  saveOfflineProject({ id, title })
    .then(palette => {
      if (!navigator.onLine) {
        showProject(id, title);
      }
    })
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

const createOfflinePalette = (projectId) => {
  const colorsArray = ['color1', 'color2', 'color3', 'color4', 'color5'];
  const hexArray = colorsArray.map(color => {
    return rgba2hex($(`.${color}`).css('background-color'));
  });
  const id = Date.now();
  const palette = {
    id,
    name: $('#new-palette').val(),
    color1: hexArray[0],
    color2: hexArray[1],
    color3: hexArray[2],
    color4: hexArray[3],
    color5: hexArray[4],
    projectId
  };

  saveOfflinePalette(palette)
    .then(palette => {
      if (!navigator.onLine) {
        appendPalette(projectId, palette.name, hexArray, palette.id);
      }
    })
    .catch(error => { throw error; });
};

const addOfflinePalette = () => {
  loadOfflineProjects()
    .then(projects => projects.find(project => project.title === $('select').val()))
    .then(project => createOfflinePalette(project.id))
    .catch(error => { throw error; });
};

const handleAddPal = () => {
  fetch('./api/v1/projects')
    .then(res => res.json())
    .then(res => res.find(project => project.title === $('select').val()))
    .then(res => res.id).then(res => addPalette(res))
    .catch(error => { throw error; });
  addOfflinePalette();
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

let db = new Dexie('palettePicker');

db.version(1).stores({
  projects: 'id, title',
  palettes: 'id, name, color1, color2, color3, color4, color5, projectId'
});

const saveOfflineProject = project => {
  return db.projects.add(project);
};

const saveOfflinePalette = palette => {
  return db.palettes.add(palette);
};

const loadOfflineProjects = () => {
  return db.projects.toArray();
};

const loadOfflinePalettes = id => {
  return db.palettes.toArray();
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../service-worker.js')
      .then(registration => navigator.serviceWorker.ready)
      .then(registration => {
        Notification.requestPermission();
        console.log('ServiceWorker registration successful');
      }).catch(error => {
        console.log(`ServiceWorker registration failed: ${error}`);
      });

  });
}
