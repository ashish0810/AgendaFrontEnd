function viewCheckBoxHandler() {
	var checked = document.getElementById("viewAll").checked;
	var divPend = document.getElementById("PendingTasks");
	var divAll = document.getElementById("AllTasks");
	if (checked) {
		divPend.style.display = "none";
		divAll.style.display = "block";
	} else {
		divPend.style.display = "block";
		divAll.style.display = "none";
	}
}

function updateList() {
	$.ajax({
		type: "POST",
		url: "process.php",
		data: {
			function: 'update'
		},
		dataType: "text",
		success: function(response) {
			document.getElementById("tableWrapper").innerHTML = response;
		},
	});
}

function addTask() {
	var classin = document.getElementById("addformClass").options[document.getElementById("addformClass").selectedIndex].innerHTML;
	var taskin = document.getElementById("addformTask").value;
	var datein = document.getElementById("addformDate").value;
	var tablein = document.getElementById("addformTable").value;
	$.ajax({
		type: "POST",
		async: false,
		url: "process.php",
		data: {
			'function': 'add',
			'class': classin,
			'task': taskin,
			'date': datein
		},
		dataType: "json",
		success: afterAddingTask()
	});
	afterAddingTask();
}

function afterAddingTask() {
	updateList();
	document.getElementById("addForm").reset();
}

function finishTask(id) {
	var tablein = document.getElementById("addformTable").value;
	$.ajax({
		type: "POST",
		async: false,
		url: "process.php",
		data: {
			'function': 'finish',
			'id': id
		},
		dataType: "json",
		success: updateList()
	});
	updateList();
}

function updateLog() {
	var tablein = document.getElementById("addformTable").value;
	$.ajax({
		type: "POST",
		async: false,
		url: "process.php",
		data: {
			'function': 'updateLog'
		},
		dataType: "json",
		success: updateList()
	});
	updateList();
}

function notificationTimeOut() {
	if (document.getElementById("stateNotification").style.display != "none") {
		var start = new Date().getTime();
		var end = start;
		while (end < start + 5000) {
			end = new Date().getTime();
		}
		document.getElementById("stateNotification").style.display = "none";
	}
}