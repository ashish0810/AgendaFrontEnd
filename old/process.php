<?php
session_start();
$table = $_SESSION["user"];
$class_value = $_SESSION['class_value'];
$function = $_POST['function'];

$log = array();

switch($function) {
	case('update'):
		$conn = new mysqli('localhost', 'agendaUser', 'agendaSQLpassword', 'agendaDB');
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}
		$sqlPend = "SELECT * FROM $table WHERE stat='N' ORDER BY due";
		$resultPend = $conn->query($sqlPend);
		echo "<div id='PendingTasks' style='display: block;'>";
		if ($resultPend->num_rows > 0) {
			echo "<table border='1' class='tasksTab'><tr><th>Class</th><th>Task</th><th>Due Date</th><th>Status</th></tr>";
			while($rowP = $resultPend->fetch_assoc()) {
				$arrDP = explode("-", $rowP["due"]);
				$dayP = date("D", mktime(0, 0, 0, $arrDP[1], $arrDP[2], $arrDP[0]));
				$dateP = $arrDP[1] . "/" .  $arrDP[2] . ", " . $dayP;
				$linkDoneP = "finished.php?id=" . $rowP["id"];
				echo "<tr><td>" . $rowP["class"] . "</td><td>" . $rowP["task"] . "</td><td>" . $dateP . "</td><td><a href='$linkDoneP'>Not Done</a></td></tr>";
			}
			echo "</table>";
		} else {
			echo "0 results";
		}
		echo "</div>";
		$sqlAll = "SELECT * FROM $table ORDER BY due";
		$resultAll = $conn->query($sqlAll);
		echo "<div id='AllTasks' style='display: none'>";
		if ($resultAll->num_rows > 0) {
			echo "<table border='1' class='tasksTab'><tr><th>Class</th><th>Task</th><th>Due Date</th><th>Status</th></tr>";
			while($rowA = $resultAll->fetch_assoc()) {
				$arrDA = explode("-", $rowA["due"]);
				$dayA = date("D", mktime(0, 0, 0, $arrDA[1], $arrDA[2], $arrDA[0]));
				$dateA = $arrDA[1] . "/" .  $arrDA[2] . ", " . $dayA;
				$linkDone = "finished.php?id=" . $rowA["id"];
				if ($rowA["stat"] == "N") {
					echo "<tr><td>" . $rowA["class"] . "</td><td>" . $rowA["task"] . "</td><td>" . $dateA . "</td><td><a href='$linkDone'>Not Done</a></td></tr>";
				} else {
					echo "<tr class='finishedRows'><td>" . $rowA["class"] . "</td><td>" . $rowA["task"] . "</td><td>" . $dateA . "</td><td>Done</td></tr>";
				}
			}
			echo "</table>";
		} else {
			echo "0 results";
		}
		echo "</div>";
		break;
		
	case('add'):
		$class = $_POST["class"];
		$task = $_POST["task"];
		$date = $_POST["date"];
		$conn = new mysqli('localhost', 'agendaUser', 'agendaSQLpassword', 'agendaDB');
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}
		$sql = "INSERT INTO $table (class, task, due, stat) VALUES ('$class', '$task', '$date', 'N')";
		if ($conn->query($sql) === TRUE) {
			echo "Success!";
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
		}
		break;
		
	case('finish'):
		$id = $_POST["id"];
		$conn = new mysqli('localhost', 'agendaUser', 'agendaSQLpassword', 'agendaDB');
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}
		$sql = "UPDATE $table SET stat='D' WHERE id='$id'";
		if ($conn->query($sql) === TRUE) {
			echo "Success!";
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
		}
		break;
		
	case('updateLog'):
		$conn = new mysqli('localhost', 'agendaUser', 'agendaSQLpassword', 'agendaDB');
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}
		$sql = "UPDATE login SET last_login=NOW() WHERE user='$table'";
		if ($conn->query($sql) === TRUE) {
			echo "Success!";
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
		}
		break;
		
	case('finish'):
		break;
}

?>