const urlBase = "http://localhost:3000";

function login() {
    var user = document.getElementById("loginFormUser").value;
    var pass = document.getElementById("loginFormPass").value;
    var errorBox = document.getElementById("errorMessage");
    errorBox.innerHTML = "";
    var url = urlBase + "/login"
    $.ajax({
        type: "POST",
        url: url,
        data: {
            'user': user,
            'pass': pass
        },
        dataType: "json",
        success: function(response) {
            console.log(response);
            if (response.statusCode == 200) {
                console.log("Successful login");
                // go to agenda with login info
                setCookie(response.body.user, response.body.name, response.body.color, response.body.class_value, response.body.token);
                document.location.href = "agenda.html";
            } else if (response.statusCode == 201) {
                console.log("Invalid login");
                errorBox.innerHTML = "Username/Password is Incorrect";
            } else {
                console.log("Something is messed up");
                errorBox.innerHTML = "Something went wrong, the agenda service might be down or inaccessible";
            }
        }
    });
}

function logout() {
    clearCookies();
    document.location.href = "index.html";
}

function fillAgendaPage() {
    var name = getCookie("name");
    document.title = name + "'s Agenda";
    document.getElementById("title").innerHTML = name + "'s Agenda";
}

function fillTasks() {
    var user = getCookie("user");
    var token = getCookie("token");
    var url = urlBase + "/tasks?user=" + user;
    $.ajax({
        type: "GET",
        url: url,
        headers: {
            'token': token
        },
        success: function(response) {
            if (response.statusCode == 200) {
                populateTasks(response.body.tasks);
            } else if (response.statusCode == 201) {
                logout();
            } else {
                console.log("Something is messed up");
            }
        }
    });
}

function populateTasks(tasks) {
    var table = "<table border='1' class='tasksTable'><tr>";
    table += "<th>Class</th>";
    table += "<th>Task</th>";
    table += "<th>Due Date</th>";
    table += "<th>Status</th>";
    table += "</tr>";
    for (var i = 0; i < tasks.length; i++) {
        var row = "<tr>";
        row += "<td>" + tasks[i].class + "</td>";
        row += "<td>" + tasks[i].task + "</td>";
        var date = new Date(tasks[i].due);
        row += "<td>" + date.getMonth() + "/" + date.getDate() + ", " + dayString(date.getDay()) + "</td>";
        if (tasks[i].stat == "N") {
            row += "<td><a onclick='finishTask(" + tasks[i].id + ")' href='javascript:void(0);'>Not Done</a></td>";
        } else {
            row += "<td>Done</td>";
        }
        row += "</tr>";
        table += row;
    }
    table += "</table>";
    document.getElementById("tableWrapper").innerHTML = table;
}

function finishTask(id) {
    var user = getCookie("user");
    var token = getCookie("token");
    var url = urlBase + "/tasks?user=" + user;
    $.ajax({
        type: "PUT",
        url: url,
        headers: {
            'token': token
        },
        data: {
            'taskId': id
        },
        dataType: "json",
        success: function(response) {
            if (response.statusCode == 200) {
                fillTasks();
            } else if (response.statusCode == 201) {
                logout();
            } else {
                console.log("Something is messed up");
            }
        }
    });
}

function dayString(num) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (num < 0 || num > 6) {
        return "Error";
    }
    return days[num];
}

function setCookie(user, name, color, class_value, token) {
    var d = new Date();
    d.setTime(d.getTime() + (30*60*1000));
    document.cookie = "user=" + user + ";expires=" + d.toUTCString() + ";path=/";
    document.cookie = "name=" + name + ";expires=" + d.toUTCString() + ";path=/";
    document.cookie = "color=" + color + ";expires=" + d.toUTCString() + ";path=/";
    document.cookie = "classes=" + class_value + ";expires=" + d.toUTCString() + ";path=/";
    document.cookie = "token=" + token + ";expires=" + d.toUTCString() + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.clength);
        }
    }
    return "";
}

function clearCookies() {
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "color=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "classes=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}