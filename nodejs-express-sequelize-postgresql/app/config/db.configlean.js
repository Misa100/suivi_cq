const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '192.168.12.232',
  database: 'dashboardlean2023',
  password: 'postgres',
  port: 5432,
});

pool.connect(function(error){
  if(!!error){
    console.log(error);
  }else{
    console.log('Connected! DashboardLean');
  }
});

module.exports = pool;