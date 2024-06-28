const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '192.168.18.230',
  database: 'prodigy',
  password: 'postgres',
  port: 5432,
});

pool.connect(function(error){
  if(!!error){
    console.log(error);
  }else{
    console.log('Connected! Framework JS');
  }
});

module.exports = pool;