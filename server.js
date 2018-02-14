const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const app = express();
const DATABASE = 'stuff.db'
const db = new sqlite3.Database(DATABASE);
const path = require('path');
const exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

// Use this to parse the body of post requests
app.use(bodyParser.json())

// Use this to server static files from the 'static' directory
app.use('/static', express.static('static'))

// Configure the template/view engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

// Our homepage---just send the index.html file
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

// Our API for getting tasks
app.get('/api/tasks', (req, res) => {
	let task_list =[];
	getTasks(function(rows){
	res.render('task-list',{tasks:rows});
	console.log((rows))
	});

});

function getTasks(cb){
	db.all('SELECT rowid,body,date,complete FROM tasks', function(err, rows){
		cb(rows);
	});
}


const create_table = `
CREATE TABLE IF NOT EXISTS tasks (
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  body TEXT,
  complete BOOLEAN DEFAULT FALSE
)
`;


db.serialize(function() {
  db.run(create_table);
	const port = process.env.PORT;
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
});

