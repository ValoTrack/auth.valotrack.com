const express = require('express');
const bodyParser = require("body-parser");
const mysql = require('mysql2');
const { port } = require('./config/config.json');
var fs = require('fs');

// file is included here:
eval(fs.readFileSync('./Sync.js')+'');


const startSync	 = setInterval(function(){ 
    ForceSync();
}, 600000);

const app = express();

app.get('/', (request, response) => {
	return response.sendFile('index.html', { root: '.' });
});

app.use(express.static(__dirname + '/public'));
app.listen(port, () => console.log(`ValoTrack Sync Started`));
ForceSync();