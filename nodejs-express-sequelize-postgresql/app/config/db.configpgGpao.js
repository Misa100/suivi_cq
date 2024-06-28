const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '192.168.12.245',
  database: 'gpao',
  password: 'postgres',
  port: 5432,
});

pool.connect(function(error){
  if(!!error){
    console.log(error);
  }else{
    console.log('Connected! GPAO');
  }
});

module.exports = pool;