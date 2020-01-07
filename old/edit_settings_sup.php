<?php

session_start();

$user = $_SESSION['user'];
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

if ($_POST['pass'] == "") {
  $sql = "update login set name='$name', color='$color', class_value='$classes' where user='$user';";
} else {
  $sql = "update login set pass='$pass', name='$name', color='$color', class_value='$classes' where user='$user';";
}


echo $sql;
if ($conn->query($sql) == TRUE) {
	$_SESSION['user'] = $user;
	$_SESSION['name'] = $name;
  $_SESSION['color'] = $color;
  $_SESSION['class_value'] = explode(",", $classes);
  $_SESSION['state'] = "settings";
	header('Location: http://ashishbach.com/agenda/agenda.php');
} else {
	echo "Had some problems, please return to edit settings form and try again";
}

?>