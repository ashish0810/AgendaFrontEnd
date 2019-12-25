<!DOCTYPE html>
<html>
	<head>
		<title>Adding Task</title>
		<!--<link rel="stylesheet" type="text/css" href="actionstyle.css" />-->
		<link rel="stylesheet" type="text/css" href="style3.css" />
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
		<script>
			function loader(input) {
				var elem = document.getElementById("myBar");
				var stat = document.getElementById("status");
				var msg = input;
				var width = 1;
				var id = setInterval(frame, 20);
				function frame() {
					if (width >= 100) {
						clearInterval(id);
						setTimeout(function() {
							window.location.assign("http://ashishbach.com/agenda/agenda.php");
						}, 1000);
					} else {
						width++;
						elem.style.width = width + '%';
						if (width >= 0 && width <= 10) {
							stat.innerHTML = "locating server ...";
						} else if (width >= 11 && width <= 20) {
							stat.innerHTML = "establishing connection ...";
						} else if (width >= 21 && width <= 30) {
							stat.innerHTML = "encrypting connection ...";
						} else if (width >= 31 && width <= 40) {
							stat.innerHTML = "loading dependencies ...";
						} else if (width >= 41 && width <= 50) {
							stat.innerHTML = "searching databases for identities ...";
						} else if (width >= 51 && width <= 60) {
							stat.innerHTML = "logging entry ...";
						} else if (width >= 61 && width <= 70) {
							stat.innerHTML = "alerting NSA of location and identity ...";
						} else if (width >= 71 && width <= 80) {
							stat.innerHTML = "adding task ...";
						} else if (width >= 81 && width <= 100) {
							stat.innerHTML = msg;
						}
					}
				}
			}
		</script>
	</head>
	<body>
		<div id="wrapper">
			<h1 id="title">
				<?php
				session_start();
				$name = $_SESSION['name'];
				$class_keys = $_SESSION['class_key'];
				$class_value = $_SESSION['class_value'];
				echo $name;
				?>'s Agenda</h1>
			<h2>Adding Task</h2>
			<h3 id="status">locating server ...</h3>
			<?php
			$table = $_SESSION["user"];
			$class_in = $_POST["class"];
      $class = $class_value[array_search($class_in, $class_key)];
			$task = $_POST["task"];
			$due = $_POST["due"];
			$servername = "localhost";
			$username = "root";
			$password = "ashSQLpassword";
			$dbname = "agendaDB";

// 			switch ($class) {
// 				case "math246h":
// 					$class = "Differential Equations";
// 					break;
// 				case "engl101":
// 					$class = "English 101";
// 					break;
// 				case "enes100":
// 					$class = "Intro to Engineering";
// 					break;
// 				case "phys260":
// 					$class = "Physics 2";
// 					break;
// 				case "phys261":
// 					$class = "Physics 2 Lab";
// 					break;
// 				default:
// 					$class = "Miscellaneous";
// 					break;
// 			}
			
			$conn = new mysqli($servername, $username, $password, $dbname);
			// Check Connection
			if ($conn->connect_error) {
				die("Connection failed: " . $conn->connect_error);
			}
			
			$sql = "INSERT INTO $table (class, task, due, stat) VALUES ('$class', '$task', '$due', 'N')";
			
			if ($conn->query($sql) === TRUE) {
				echo "<script type='text/javascript'> $(document).ready(function() {loader('New Entry Successfully Added!');});</script>";
			} else {
				echo "Error: " . $sql . "<br>" . $conn->error;
			}
			?>
			<div id="myProgress"><div id="myBar"></div></div>
		</div>
	</body>
</html>