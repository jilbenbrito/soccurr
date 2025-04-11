<?php
	$inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];

	$conn = new mysqli("localhost", "john", "cis4004Root", "CIS4004");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$query = $conn->prepare("SELECT * FROM Users WHERE Login =?");
		$query->bind_param("s", $login); 
		$query->execute();
		$query->store_result(); 
		$result = $query->num_rows;

		if ($result > 0) {
    			returnWithError("Login Already Exists!");
			exit();
		}

		$stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
