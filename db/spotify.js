const knex = require('./connection');

module.exports = {

  getByUser: function(id){
    return knex('spotify').where('user_id', id);
  }
}
