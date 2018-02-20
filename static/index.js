
let tasks = [];


// reqListener is called when the XMLHttpRequest
// to the server is complete
function reqListener () {

	// Add the tasks to our array of tasks
	tasks = tasks.concat(this.response);

	// Add the tasks to the DOM
	let ulElement = document.querySelector('ul');
	this.response.forEach((task) => {
		var newli = document.createElement("li");
		newli.appendChild(document.createTextNode(task.body));
		ulElement.appendChild(newli);
	});
}
// requesttasks requests the latest tasks from
// the server.
function requesttasks(){
	var oReq = new XMLHttpRequest();
	if(tasks.length > 0){
		maxID = tasks[tasks.length-1].rowid;
	}else{
		maxID = 0;
	}
	oReq.open("GET", "/api/tasks?latest=" + maxID)
	oReq.responseType = 'json';
	oReq.addEventListener("load", reqListener);
	oReq.send();
}

// Run requesttasks every 2s
setInterval(requesttasks, 2000);


// Grab the value that is in the text box and send it to the server
function sendtaskToServer(){
	console.log('running sendtasktoServer')
	const textBox = document.querySelector('input[type=text]');
	var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
	xmlhttp.open("POST", "/api/tasks");
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.send(JSON.stringify({ body: textBox.value }));
	textBox.value = '';
}

document.addEventListener("DOMContentLoaded", function() {
	console.log('running event listener')
	const submitButton = document.querySelector('input[type=submit]');
	submitButton.addEventListener('click', (event) => {
		// Stop the default action, which is to submit the form
		// https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
		event.preventDefault();
		sendtaskToServer();
	});
});

// Update Completed when button is pushed
function markTaskComplete(){
	console.log('running markTask')
	const rowid = document.querySelector('input[type=number]');
	var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
	xmlhttp.open("POST", "/api/tasks/completed");
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.send(JSON.stringify({ body: "rowid" }));
	task.value = '';
}

document.addEventListener("DOMContentLoaded", function() {
	const submitButton = document.querySelector("input[type=hidden]");
	submitButton.addEventListener('click', (event) => {
		// Stop the default action, which is to submit the form
		// https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
		event.preventDefault();
		markTaskComplete();
	});
});

