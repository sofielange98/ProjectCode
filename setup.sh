cp .env.sample .env
createdb dynamic-rhythm
npm install
knex migrate:latest
knex seed:run
