const knex = require('./connection');

module.exports = {

  getByUser: function(id){
    return knex('google').where('user_id', id);
  }
}
