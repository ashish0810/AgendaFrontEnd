const urlBase = "http://localhost:3000";

// LOGIN/USER STUFF

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

function register() {
    var name = document.getElementById("regFormName").value;
    var user = document.getElementById("regFormUser").value;
    var pass = document.getElementById("regFormPass").value;
    var color = document.getElementById("regFormColor").value;
    var classes = document.getElementById("regFormClasses").value;
    var errorBox = document.getElementById("errorMessage");
    errorBox.innerHTML = "";
    if (name.length < 4 || name.length > 20) {
        errorBox.innerHTML += "Name must be 4 to 20 characters<br />";
    }
    if (user.length < 4 || user.length > 20) {
        errorBox.innerHTML += "Username must be 4 to 20 characters<br />";
    }
    if (pass.length < 4 || pass.length > 20) {
        errorBox.innerHTML += "Password must be 4 to 20 characters<br />";
    }
    if (classes.length == 0) {
        errorBox.innerHTML += "Must add some classes<br />";
    }
    if (errorBox.innerHTML != "") {
        console.log("Some errors, not calling registration api");
        return;
    }
    console.log("Calling registration api");
    var url = urlBase + "/login/reg";
    $.ajax({
        type: "POST",
        url: url,
        data: {
            'name': name,
            'user': user,
            'pass': pass,
            'color': color,
            'classes': classes
        },
        dataType: "json",
        success: function(response) {
            console.log(response);
            if (response.statusCode == 200) {
                setCookie(response.body.user, response.body.name, response.body.color, response.body.class_value, response.body.token);
                document.location.href = "agenda.html";
            } else if (response.statusCode == 201) {
                errorBox.innerHTML = "Something went wrong, the agenda service might be down or inaccessible";
            }
        }
    });
}

function changeSettings() {
    var name = document.getElementById("settingsFormName").value;
    var pass = document.getElementById("settingsFormPass").value;
    var color = document.getElementById("settingsFormColor").value;
    var classes = document.getElementById("settingsFormClasses").value;
    var user = getCookie("user");
    var token = getCookie("token");
    var url = urlBase + "/login/update";
    if (pass == "") {
        $.ajax({
            type: "POST",
            url: url,
            headers: {
                'token': token
            },
            data: {
                'user': user,
                'name': name,
                'color': color,
                'classes': classes
            },
            dataType: "json",
            success: updateCallback
        });
    } else {
        $.ajax({
            type: "POST",
            url: url,
            headers: {
                'token': token
            },
            data: {
                'user': user,
                'name': name,
                'color': color,
                'classes': classes,
                'pass': pass
            },
            dataType: "json",
            success: updateCallback
        });
    }
}

function updateCallback(response) {
    if (response.statusCode == 200) {
        setCookie(response.body.user, response.body.name, response.body.color, response.body.class_value, response.body.token);
        document.location.href = "agenda.html";
    } else if (response.statusCode == 201) {
        logout();
    } else {
        console.log("Something is messed up");
    }
}

function deleteUser() {
    var user = getCookie("user");
    var token = getCookie("token");
    var url = urlBase + '/login';
    $.ajax({
        type: "DELETE",
        url: url,
        headers: {
            'token': token,
        },
        data: {
            'user': user,
        },
        dataType: "json",
        success: function(response) {
            if (response.statusCode == 200) {
                logout();
            } else if (response.statusCode == 201) {
                logout();
            } else {
                console.log("Something is messed up");
            }
        }
    });
}

function fillAgendaPage() {
    var user = getCookie("user");
    var name = getCookie("name");
    var color = getCookie("color");
    var class_value = getCookie("classes");
    var token = getCookie("token");
    if (user == "" || name == "" || color == "" || token == "") {
        logout();
    }
    var classes = class_value.split(",");
    document.title = name + "'s Agenda";
    document.getElementById("title").innerHTML = name + "'s Agenda";
    var classSelect = document.getElementById("addFormClass");
    for (var i = 0; i < classes.length; i++) {
        classSelect.innerHTML += "<option value='" + i + "'>" + classes[i] + "</option>";
    }
}

function updateTasks() {
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
        row += "<td>" + (date.getMonth()+1) + "/" + date.getDate() + ", " + dayString(date.getDay()) + "</td>";
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
                updateTasks();
            } else if (response.statusCode == 201) {
                logout();
            } else {
                console.log("Something is messed up");
            }
        }
    });
}

function addTask() {
    var classin = document.getElementById("addFormClass").options[document.getElementById("addFormClass").selectedIndex].innerHTML;
    var task = document.getElementById("addFormTask").value;
    var date = document.getElementById("addFormDate").value;
    var user = getCookie("user");
    var token = getCookie("token");
    var url = urlBase + "/tasks?user=" + user;
    $.ajax({
        type: "POST",
        url: url,
        headers: {
            'token': token
        },
        data: {
            'className': classin,
            'task': task,
            'dueDate': date
        },
        dataType: "json",
        success: function(response) {
            if (response.statusCode == 200) {
                updateTasks();
            } else if (response.statusCode == 201) {
                logout();
            } else {
                console.log("Something is messed up");
            }
        }
    });
}

function fillSettingsPage() {
    var name = getCookie("name");
    var user = getCookie("user");
    var color = getCookie("color");
    var classes = getCookie("classes");
    document.getElementById("settingsFormName").value = name;
    document.getElementById("settingsFormUser").value = user;
    document.getElementById("settingsFormColor").value = color;
    document.getElementById("settingsFormClasses").value = classes;
}



// HELPERS

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