const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database(process.env.DATABASE);
const path = require('path');
var bodyParser = require('body-parser');

// Use this to parse the body of post requests
app.use(bodyParser.json())

// Use this to server static files from the 'static' directory
app.use('/static', express.static('static'))

// Our homepage---just send the index.html file
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

// Our API for getting tasks
app.get('/api/tasks', (req, res) => {
	getTasks(function(rows){
		res.send(rows);
	});
});

// Our API for posting new tasks
app.post('/api/tasks', (req, res) => {
	const chatBody = req.body.body;
	db.all('INSERT INTO tasks (body) VALUES (?)', chatBody, function(err, rows){
		// Return a 500 status if there was an error, otherwise success status
		res.send(err ? 500 : 200);
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

