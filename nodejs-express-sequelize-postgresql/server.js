const express = require('express')
const cors = require("cors")
const routes = require('./app/routes/route'); // import the routes
const { createServer } = require('http')
// const { Server } = require('socket.io')

var server_pass = false

const app = express();
global.__basedir = __dirname;
var urlAPI = server_pass == false ? "http://localhost:4200" : "http://192.168.12.236"
var corsOptions = { origin: urlAPI }
var APIport = server_pass == false ? "3000" : "92"

app.use(cors(corsOptions))
app.use(express.json())

app.use("/suivis_cq_prodigy_api", routes)
//to use the routes

const listener = app.listen(process.env.PORT || APIport, () => {

    console.log('Your app is listening on port ' + listener.address().port)

})