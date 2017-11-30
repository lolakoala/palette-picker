
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
          .then(() => console.log('seeding success!'))
          .catch(error => console.log(error))
      ]);
    })
    .catch(error => console.log(error));
};
