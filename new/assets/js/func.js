const urlBase = "http://localhost:3000";

// LOGIN/USER STUFF

function login() {
    var user = document.getElementById("login-user").value;
    var pass = document.getElementById("login-pass").value;
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
    var name = document.getElementById("register-name").value;
    var user = document.getElementById("register-user").value;
    var pass = document.getElementById("register-pass").value;
    var color = document.getElementById("register-color").value;
    var classes = document.getElementById("register-classes").value;
    var errorBox = document.getElementById("register-error-box");
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
    var classSelect = document.getElementById("add-class");
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
                window.tasks = tasks;
                populateTasks(response.body.tasks);
                window.showAllTaskState = false;
                document.getElementById("view-task-label").innerHTML = "View all tasks";
                var completeTasks = document.getElementsByClassName("task-complete");
                for (var i = 0; i < completeTasks.length; i++) {
                    completeTasks[i].style.display = "none";
                }
            } else if (response.statusCode == 201) {
                logout();
            } else {
                console.log("Something is messed up");
            }
        }
    });
}

function getTaskById(id) {
    var tasks = window.tasks;
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            return tasks[i];
        }
    }
    return null;
}

function populateTasks(tasks) {
    var allTasks = "";
    for (var i = 0; i < tasks.length; i++) {
        var complete = tasks[i].stat == "D";
        var currTask = "<a class='list-group-item " + (complete ? "task-complete" : "task-incomplete") + "' data-toggle='modal' data-target='#taskModal' data-task='" + tasks[i].id + "'>";
        currTask += "<h4 class='list-group-item-heading'>" + tasks[i].task + "  <small>" + tasks[i].class + "</small></h4>";
        var date = new Date(tasks[i].due);
        currTask += "<p class='list-group-item-text'>" + (date.getMonth()+1) + "/" + date.getDate() + ", " + dayString(date.getDay()) + "<br>";
        currTask += complete ? "Done" : "Not Done";
        currTask += "</p>";
        currTask += "</a>";
        allTasks += currTask;
    }
    document.getElementById("tableWrapper").innerHTML = allTasks;
    prepModal();
}

function prepModal() {
    $('#taskModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var id = button.data('task'); // Extract info from data-* attributes

        var task = getTaskById(id);
        if (task == null) {
            return;
        }
        
        var modal = $(this);
        modal.find('.modal-body #task-id').val(id);
        modal.find('.modal-body #task-name').val(task.task);
        modal.find('.modal-body #task-class').val(task.class);
        modal.find('.modal-body #task-date').val(task.due.substring(0, 10));
        var progress = (task.stat == "D") ? 100 : 0;
        modal.find('.modal-body #task-progress').val(progress);

        var slider = document.getElementById("task-progress");
        var output = document.getElementById("task-progress-label");
        output.innerHTML = slider.value;
        slider.oninput = function() {
            output.innerHTML = this.value;
        }
    });
}

function markComplete() {
    var id = document.getElementById("task-id").value;
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
            'taskId': id,
            'progress': 100,
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

function markIncomplete() {
    var id = document.getElementById("task-id").value;
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
            'taskId': id,
            'progress': 0,
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
    var classin = document.getElementById("add-class").options[document.getElementById("add-class").selectedIndex].innerHTML;
    var task = document.getElementById("add-task").value;
    var date = document.getElementById("add-date").value;
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
                document.getElementById("add-task-form").reset();
                updateTasks();
                showAddTaskSuccessMsg();
            } else if (response.statusCode == 201) {
                logout();
            } else {
                console.log("Something is messed up");
            }
        }
    });
}

function showAddTaskSuccessMsg() {
    document.getElementById("add-task-msg-box").innerHTML = "<div class='alert alert-success' role='alert'><strong>Successfully added task!</strong></div>";
    setTimeout(() => {
        document.getElementById("add-task-msg-box").innerHTML = "";
    }, 5000);
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

function viewTaskToggle() {
    var completeTasks = document.getElementsByClassName("task-complete");
    if (window.showAllTaskState) {
        window.showAllTaskState = false;
        document.getElementById("view-task-label").innerHTML = "View all tasks";
        for (var i = 0; i < completeTasks.length; i++) {
            completeTasks[i].style.display = "none";
        }
    } else {
        window.showAllTaskState = true;
        document.getElementById("view-task-label").innerHTML = "View incomplete tasks";
        for (var i = 0; i < completeTasks.length; i++) {
            completeTasks[i].style.display = "block";
        }
    }
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