<!DOCTYPE>
<html>
	<head>
		<title>Agenda Registration</title>
		<link href="assets/css/style3.css" rel="stylesheet" type="text/css" />
	</head>
	<body>
		<div id="wrapper">
			<h1 id="title">Agenda Registration</h1>
			<div id="formContain">
				<center>
					<p style="font-style: italic; color: white;">Register below with your <br/>
					information for my agenda app to<br/>
					organize your tasks</p>
				</center>
				<form id="formReg" action="reg_sup.php" method="post">
					<input type="text" name="name" id="name" placeholder="Name" /><br/><br/>
					<input type="text" name="user" id="user" placeholder="Username" /><br/><br/>
					<input type="password" name="pass" id="pass" placeholder="Password" /><br/><span style="color: white; font-size: .75em;">Don't worry, your password is secure.  I use SHA-256 hashing so that nobody can see your password.</span><br/><br/>
					<span style="color: white;">Color:</span><br/><input type="color" name="color" id="color" value="#ff0000"><br/><br/>
					<textarea name="classes" id="classes" placeholder="Enter your classes here, separated by commas 'Class 1, Class 2, Class 3'" style="width: 250px; height: 100px;"></textarea><br/><br/>
					<input type="submit" id="submit" /><p id="errorText"></p>
				</form>
			</div>
		</div>
	</body>
</html>