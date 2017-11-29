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

const displayPalettes = (palettes, projects) => {
  projects.forEach(project => {
    const projectPals = palettes.filter(palette => palette.projectId === project.id);
    projectPals.forEach(pal => {
      const colors = [pal.color1, pal.color2, pal.color3, pal.color4, pal.color5];
      const colorDivs = colors.map(color => {
        return `<div style='background-color:${color}' class='pal-color'></div>`
      });

      $(`#project${project.id}`).append(`<div class='pal'>
        <h5>${pal.name}</h5>
        ${colorDivs.join('')}
        <img src='https://d30y9cdsu7xlg0.cloudfront.net/png/446206-200.png' alt='delete' class='delete-pal'/>
      </div>`);
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

const 

const handleAddPal = () => {
  const projectId = fetch('./api/v1/projects')
    .then(res => res.json())
    .then(res => res.find(project => project.title === $('select').val()))
    .then(res => res.id).then(res => addPalette(res));

  const colorsArray = ['color1', 'color2', 'color3', 'color4', 'color5'];
  const hexArray = colorsArray.map(color => {
    return $(`.${color}`).css('background-color');
  });
  const name = $('.new-palette').val();
  const palette = {
    name,
    color1: hexArray[1],
    color2: hexArray[2],
    color3: hexArray[3],
    color4: hexArray[4],
    color5: hexArray[5]
  };

  // fetch('./api/v1/palettes', {
  //   method: 'POST',
  //   body: JSON.stringify({ palette }),
  //   headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json'
  //   }
  // })
};

$(window).load(() => {
  getProjects();
  changeColor();
});

$(".new").click(changeColor);

$(".color").click(event => toggleLockId(event));

$('#add-project').click(handleAddProject);

$('.add-pal').click(handleAddPal)
