
const executeQuery  = (poolBase,query) =>  {
  return new Promise((resolve, reject) => {
    poolBase.query(query, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows);
      }
    });
  });
}
const executeQueryMysql  = (poolBase,query) =>  {
  return new Promise((resolve, reject) => {
    poolBase.query(query, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = {
  executeQuery,executeQueryMysql
};
