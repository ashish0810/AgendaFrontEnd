<!DOCTYPE html>
<html>

<head>
	<title>
		<?php
			session_start();
			$name = $_SESSION['name'];
			$color = $_SESSION['color'];
			$table = $_SESSION['user'];
			$class_value = $_SESSION['class_value'];
			$state = $_SESSION['state'];
			echo $name;
			if (!isset($table) || !isset($name)) {
				header("Location: index.php");
			}
			?>'s Agenda</title>
	<!--<link rel="stylesheet" type="text/css" href="style3.css" />-->
	<link href="style3.css" rel="stylesheet" type="text/css" media="only screen and (min-device-width: 801px)" />
	<link href="mobile.css" rel="stylesheet" type="text/css" media="only screen and (max-device-width: 800px)" />
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
	<script type="text/javascript" src="func.js"></script>
	<style>
		body { color: <?php echo $color; ?>; }
		a { color: <?php echo $color; ?>; }
		a:hover { background: <?php echo $color; ?>; }

		#loginContain { border: 2px solid <?php echo $color; ?>; }

		table { border: 2px solid <?php echo $color; ?>; }

		select, input[type=text], input[type=password], input[type=date], input[type=submit], #formSubmit, textarea { border: 1px solid <?php echo $color; ?>; }

		select:focus, input[type=text]:focus, input[type=password]:focus, input[type=date]:focus, input[type=submit]:focus, #formSubmit:focus, textarea:focus { border: 2px solid <?php echo $color; ?>; }

		input[type=submit]:hover, #formSubmit:hover { border: 2px solid <?php echo $color; ?>; }

		#viewAll:checked+#displayTogLab {
			background: <?php echo $color;
			?>;
		}

		#myProgress {
			border: 3px solid <?php echo $color;
			?>;
		}

		#myBar {
			background-color: <?php echo $color;
			?>;
		}

		#title {
			-webkit-text-stroke: .5px <?php echo $color;
			?>;
		}

		#stateNotification {
			border-color: <?php echo $color;
			?>;
		}
	</style>
</head>

<body onload="updateList(); updateLog();">
	<div id="wrapper">
		<h1 id="title">
			<?php echo $name;?>'s Agenda</h1>
		<span><a href="settings.php" id="linkSettings">Edit User Settings</a></span><br/><br/>
		<input id="viewAll" onclick="viewCheckBoxHandler();" type="checkbox"><label id="displayTogLab" for="viewAll">Display All Tasks</label>
		<div id="tableWrapper">
			<?php
				?>
		</div>
		<form id="addForm">
			<table border="1">
				<tr>
					<th>Class:</th>
					<td><select name="class" id="addformClass">
						<option value="" disabled selected>Select a Class</option>
							<?php for ($i = 0; $i < count($class_value); $i++) { echo "<option value='" . $i . "'>" . $class_value[$i] . "</option>\n"; }?>
							<option value="misc">Miscellaneous</option>
						</select></td>
				</tr>
				<tr>
					<th>Task:</th>
					<td><input type="text" name="task" id="addformTask" /></td>
				</tr>
				<tr>
					<th>Due Date:</th>
					<td><input type="date" name="due" id="addformDate" /></td>
				</tr>
				<?php echo "<input type='hidden' name='table' value='$table' id='addformTable' />";?>
				<tr>
					<td colspan="2"><input id="formSubmit" type="button" value="Submit" onclick="addTask()" /></td>
				</tr>
			</table>
		</form>
	</div>
	<div id="stateNotification" style="display: block;">
		<h3 id="stateNotificationText"><span style="font-size: .88em; text-decoration: underline;">Notification:</span><br/>
			<?php
					switch ($state) {
						case "registered":
							echo "You have successfully registered for this agenda!";
							$_SESSION['state'] = "normal";
							break;
						case "settings":
							echo "Your settings have been saved successfully";
							$_SESSION['state'] = "normal";
							break;
						default:
							echo "Welcome Back!";
							break;
					}
				?>
		</h3>
	</div>
</body>

</html>