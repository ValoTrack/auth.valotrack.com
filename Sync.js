const { hostname,db_port,db_name,db_user,db_pass } = require('./config/config.json');
const mysql = require('mysql2');
const https = require('https');
const connection = mysql.createConnection({ host:hostname, user:db_user, password:db_pass, database:db_name});


function ForceSync() {
    var d = new Date();
    console.log("starting sync at "+ d.toString());
    connection.changeUser({
      database : "studio5_db9"
      }, function(err) {
        if (err) {
          console.log('error in changing database', err);
        return;
      }
    });
    let sql = "SELECT * FROM valotrack_sync";
    connection.query(sql, function (err, result) {
      if (err) throw err;
      result.forEach((valorant) => {
        var currenttierdata = valorant.currenttier;
        var valoName = valorant.valorantName;
        var valoTag = valorant.valorantTag;
        var valoRegion = valorant.valorantRegion;


        https.get("https://api.henrikdev.xyz/valorant/v1/mmr/"+ valoRegion+ '/'+valoName+ '/' + valoTag, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
                
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                const datajson = JSON.parse(data);
                if(datajson.data.currenttier == currenttierdata) {
                    return;
                } else {
                    let $newval = datajson.data.currenttier;
                    let sql = "UPDATE `valotrack_sync` SET `currenttier`='"+ $newval +"' WHERE valorantName = '" + valoName + "' ";
                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                    });
                }
            });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        });
    });
}
