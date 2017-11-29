
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert([
          { title: 'seasons' },
          { title: 'pets' },
          { title: 'elements' }
        ])
          .then(() => {
            return knex('palettes').insert([
              {
                name: 'summer',
                color1: '#a3a380',
                color2: '#d6ce93',
                color3: '#efebce',
                color4: '#d8a48f',
                color5: '#bb8588',
                projectId: 1
              },
              {
                name: 'spring',
                color1: '#ee6055',
                color2: '#60d394',
                color3: '#aaf683',
                color4: '#ffd97d',
                color5: '#ff9b85',
                projectId: 1
              },
              {
                name: 'winter',
                color1: '#d1bce3',
                color2: '#c49bbb',
                color3: '#a1867f',
                color4: '#585481',
                color5: '#19297c',
                projectId: 1
              },
              {
                name: 'fall',
                color1: '#e06c9f',
                color2: '#f283b6',
                color3: '#edbfb7',
                color4: '#b5bfa1',
                color5: '#6e9887',
                projectId: 1
              },
              {
                name: 'ralphie',
                color1: '#0d160b',
                color2: '#785589',
                color3: '#977390',
                color4: '#ac7b7d',
                color5: '#bb8a89',
                projectId: 2
              },
              {
                name: 'schweetz',
                color1: '#550527',
                color2: '#688e26',
                color3: '#faa613',
                color4: '#f44708',
                color5: '#a10702',
                projectId: 2
              },
              {
                name: 'totoro',
                color1: '#cad178',
                color2: '#d3d57c',
                color3: '#c7aa74',
                color4: '#957964',
                color5: '#603140',
                projectId: 2
              },
              {
                name: 'water',
                color1: '#9dd9d2',
                color2: '#79bcb8',
                color3: '#5ec2b7',
                color4: '#2ca6a4',
                color5: '#3aa7a3',
                projectId: 3
              },
              {
                name: 'earth',
                color1: '#33658a',
                color2: '#86bbd8',
                color3: '#758e4f',
                color4: '#f6ae2d',
                color5: '#f26419',
                projectId: 3
              },
              {
                name: 'air',
                color1: '#f7fff7',
                color2: '#343434',
                color3: '#2f3061',
                color4: '#ffe66d',
                color5: '#6ca6c1',
                projectId: 3
              },
              {
                name: 'fire',
                color1: '#6f1d1b',
                color2: '#bb9457',
                color3: '#432818',
                color4: '#99582a',
                color5: '#ffe6a7',
                projectId: 3
              }
            ])
            //end palettes insert
          })
          .then(() => console.log('seeding success!'))
          .catch(error => console.log(error))
      ]); //end promise.all
    })
    .catch(error => console.log(error));
};

// exports.seed = function(knex, Promise) {
//   // Deletes ALL existing entries
//   //delete child table before parent table
//   return knex('footnotes').del() //delete all footnotes
//     .then(() => knex('papers').del()) //delete all papers
//     .then(() => {
//       return Promise.all([
//         knex('papers').insert({
//           title: 'Foo', author: 'Bob'
//         }, 'id') //second arg is column you want back, returns entire object if no arg
//         //always returns anything as an array
//         .then(paper => {
//           return knex('footnotes').insert([
//             { note: 'Lorem', paper_id: paper[0] },
//             { note: 'Ipsum', paper_id: paper[0] }
//           ])//end footnotes insert
//         })
//         .then(() => console.log('Seeding Complete!'))
//         .catch(error => console.log({ error }))
//       ]) //end Promise.all
//     }) //end .then()
//     .catch(error => console.log({ error }))
// };
