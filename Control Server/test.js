var http = require('http');

 var Datastore = require('nedb');
 var db = new Datastore({
  filename: '../Telnet Server/Logs/telnet-logs.db', // provide a path to the database file 
  autoload: true, // automatically load the database
  timestampData: true // automatically add and manage the fields createdAt and updatedAt
});

var telnet_logs;
db.find({}).sort({
    updatedAt: -1
  }).exec(function(err, logs) {
    if (err) res.send(err);
    telnet_logs = logs;
  });

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain','Enconding':"utf-8"});
  res.write("Android Honeypot\n\n")
  res.write("Telnet Logs\n\n")
  for(i=0;i<telnet_logs.length;i++){
  	res.write(telnet_logs[i].Servicio+" ");
  	res.write(telnet_logs[i].createdAt+" ");
  	res.write(telnet_logs[i].AtacanteIP+" ");
  	res.write(telnet_logs[i].ServerIP+" ");
  	res.write(telnet_logs[i].Comando+" \n");
  }
  res.end();
}).listen(9008, '127.0.0.1');
console.log('Server running at http://127.0.0.1:9008/');