const { range } = require("rxjs");
const pool = require("../config/db.config");

// Get Current Date and Time
const getDateTime = (req, res, next) => {     
    pool.query("select now() as now, to_char(now(),'yyyy-MM-dd') as date_format", [], function (err, result) {
       if (err) {
        res.status(400).send(err);
    }
    if (Object.keys(result).length > 0) {
        res.status(200).send(result.rows);
    } else {
        res.status(200).send();
    }
});
};

module.exports = {getDateTime};