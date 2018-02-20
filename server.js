const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const app = express();
const DATABASE = 'task-list.db'
const db = new sqlite3.Database(DATABASE);
const path = require('path');
const exphbs = require('express-handlebars');
const port = 3000;
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
	});

});

function getTasks(cb){
	db.all('SELECT rowid,body,date,complete FROM tasks', function(err, rows){
		cb(rows);
	});
}

// Our API for posting new tasks
app.post('/api/tasks', (req, res) => {
	console.log(req.body.body)
	const taskBody = req.body.body;
	db.all('INSERT INTO tasks (body) VALUES (?)', taskBody, function(err, rows){
		// Return a 500 status if there was an error, otherwise success status
		res.send(err ? 500 : 200);
	});
});

// Our API for marking complete
app.post('/api/tasks/completed', (req, res) => {
	console.log(req)
	const rowid = req.body['rowid'];
	console.log(rowid)
	db.all('UPDATE tasks SET complete=1 WHERE rowid = $1',rowid, function(err, rows){
		// Return a 500 status if there was an error, otherwise success status
		res.send(err ? 500 : 200);
	});
});

const create_table = `
CREATE TABLE IF NOT EXISTS tasks (
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  body TEXT,
  complete BIT DEFAULT NULL
)
`;


db.serialize(function() {
  db.run(create_table);
	
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
});

