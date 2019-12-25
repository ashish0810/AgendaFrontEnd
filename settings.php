<!DOCTYPE>
<html>
	<head>
		<?php
		session_start();
		$name = $_SESSION['name'];
		$user = $_SESSION['user'];
		$color = $_SESSION['color'];
		$classes = $_SESSION['class_value'];
		?>
		<title>Edit Settings</title>
		<link href="style3.css" rel="stylesheet" type="text/css" />
		<style>
			body {color: <?php echo $color;?>;}
			a {color: <?php echo $color;?>;}
			a:hover {background: <?php echo $color;?>;}
			#loginContain {border: 2px solid <?php echo $color;?>;}
			table {border: 2px solid <?php echo $color;?>;}
			select, input[type=text], input[type=password], input[type=date], input[type=submit], textarea {border: 1px solid <?php echo $color;?>;}
			select:focus, input[type=text]:focus, input[type=password]:focus, input[type=date]:focus, input[type=submit]:focus, textarea:focus {border: 2px solid <?php echo $color;?>;}
			input[type=submit]:hover {border: 2px solid <?php echo $color;?>;}
			#viewAll:checked + #displayTogLab {background: <?php echo $color;?>;}
			#myProgress {border: 3px solid <?php echo $color;?>;}
			#myBar {background-color: <?php echo $color;?>;}
      #title {-webkit-text-stroke: .5px <?php echo $color;?>;}
			#stateNotification {border-color: <?php echo $color;?>;}
		</style>
	</head>
	<body>
		<div id="wrapper">
			<h1 id="title">Edit <?php echo $name;?>'s Settings</h1>
			<div id="formContain">
				<center>
					<p style="font-style: italic; color: white;">Edit your user settings</p>
				</center>
				<form id="formReg" action="edit_settings_sup.php" method="post">
					<input type="text" name="name" id="name" placeholder="Name" value="<?php echo $name;?>" /><br/><br/>
					<input type="password" name="pass" id="pass" placeholder="Password (Leave blank to remain unchanged)" /><br/><br/>
					<span style="color: white;">Color:</span><input type="color" name="color" id="color" value="<?php echo $color;?>"><br/><br/>
					<textarea name="classes" id="classes" placeholder="Enter your classes here, separated by commas 'Class 1, Class 2, Class 3'" style="width: 250px; height: 100px;"><?php echo implode(",", $classes);?></textarea><br/><br/>
					<input type="checkbox" name="deleteAllTasks" id="deleteAllTasks" value="delete" disabled /><span style="color: white;">Delete All Tasks Permanently?<br/>(This feature is still being implemented)</span><br/><br/>
					<input type="submit" id="submit" /><p id="errorText"></p>
				</form>
				<hr style="width: 70%;" />
				<button type="button" name="deleteAccount" id="deleteAccount" disabled>Delete Account</button><br/><span style="color: white;">(This feature is still being implemented)</span>
			</div>
		</div>
	</body>
</html>