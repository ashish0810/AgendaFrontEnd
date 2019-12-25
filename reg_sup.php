<?php

session_start();

$user = $_POST['user'];
$pass = hash("sha256", $_POST['pass']);
$name = $_POST['name'];
$color = $_POST['color'];
$classes = $_POST['classes'];

$servername = "localhost";
$username = "agendaUser";
$password = "agendaSQLpassword";
$dbname = "agendaDB";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}

$sql = "insert into login (user, pass, name, color, class_value) values ('$user', '$pass', '$name', '$color', '$classes');";
$sql .= "create table $user (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, class tinytext, task tinytext, due date, stat char(1));";

echo $sql;
if ($conn->multi_query($sql) == TRUE) {
	$_SESSION['user'] = $user;
	$_SESSION['name'] = $name;
  $_SESSION['color'] = $color;
  $_SESSION['class_value'] = explode(",", $classes);
  $_SESSION['state'] = "registered";
	header('Location: http://ashishbach.com/agenda/agenda.php');
} else {
	echo "Had some problems, please return to registration form and try again";
}

?>