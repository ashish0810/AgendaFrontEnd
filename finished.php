<!DOCTYPE html>
<html>
	<head>
		<title>Finished Task</title>
		<!--<link rel="stylesheet" type="text/css" href="actionstyle.css" />-->
		<link rel="stylesheet" type="text/css" href="assets/css/style3.css" />
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
		<script>
			function loader(input) {
				var elem = document.getElementById("myBar");
				var stat = document.getElementById("status");
				var msg = input;
				var width = 1;
				var id = setInterval(frame, 8);
				function frame() {
					if (width >= 100) {
						clearInterval(id);
						setTimeout(function() {
							window.location.assign("http://ashishbach.com/agenda/agenda.php");
						}, 200);
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
							stat.innerHTML = "finishing task ...";
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
				echo $name;
				?>'s Agenda</h1>
			<h2>Finishing Task</h2>
			<h3 id="status">locating server ...</h3>
			<?php
			session_start();
			$id = $_GET["id"];
			$table = $_SESSION['user'];
			$servername = "localhost";
			$username = "agendaUser";
			$password = "agendaSQLpassword";
			$dbname = "agendaDB";
			
			$conn = new mysqli($servername, $username, $password, $dbname);
			// Check Connection
			if ($conn->connect_error) {
				die("Connection failed: " . $conn->connect_error);
			}
			
			$sql = "UPDATE $table SET stat='D' WHERE id='$id'";
			
			if ($conn->query($sql) === TRUE) {
				echo "<script type='text/javascript'> $(document).ready(function() {loader('Task Successfully Marked As Finished!');});</script>";
			} else {
				echo "Error: " . $sql . "<br>" . $conn->error;
			}
			?>
			<div id="myProgress"><div id="myBar"></div></div>
		</div>
	</body>
</html>