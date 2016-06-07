var express = require("express"), 
 	path = require('path'), 
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override"),
    Datastore = require('nedb');

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());

//Usar vistas ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//Para poder usar CSS y JS de la plantilla
app.use(express.static(__dirname + '/public'));

var router = express.Router();

app.get('/', function(req, res) {
	//Carga la BD cada vez que se llama a '/'
	//Si se pone fuera de este método no carga los logs nuevos
	var db = new Datastore({
  		filename: '../Telnet Server/Logs/telnet-logs.db', // provide a path to the database file 
  		autoload: true, // automatically load the database
  		timestampData: true // automatically add and manage the fields createdAt and updatedAt
	});
	//Recupera todos los logs por orden de modificación
  	db.find({}).sort({
  	  updatedAt: -1
  	}).exec(function(err, logs) {
  	  if (err) res.send(err);
  	  var obj = { 
  	    logs: logs,
  	    helpers: {
  	      formatCreatedAt: function() {
  	        return this.createdAt.toLocaleDateString();
  	      }
  	    }
  	  };
  	  //Carga página y pasa obj 
      res.render('elements.ejs', {obj: obj});
  	});
});

app.use(router);
app.listen(9008, '127.0.0.1');  
console.log("Servidor de control en http://127.0.0.1:9008");