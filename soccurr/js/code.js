const urlBase = 'http://soccurr.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doSignup()
{
    document.getElementById("loginResult").innerHTML = "";
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    // Check for empty logins
    let hasAlphanumeric = false;
    for (let i = 0; i < login.length; i++) {
	if ((login.charAt(i) >= '1' && login.charAt(i) <= '9') || (login.charAt(i) >= 'a' && login.charAt(i) <= 'z') || (login.charAt(i) >= 'A' && login.charAt(i) <= 'Z')) hasAlphanumeric = true;
    }
    if (!hasAlphanumeric)
    {
	document.getElementById("loginResult").innerHTML = "Your username must have at least one letter or one number.";
	return;
    }	
    // Check if the password is at least eight characters long
    if (password.length < 8)
    {
	document.getElementById("loginResult").innerHTML = "Your password must be at least eight characters long.";
	return;
    }
    // Check if the password has at least one number and letter
    let hasNumber = false;
    let hasUppercaseLetter = false;
    let hasLowercaseLetter = false;
    for (let i = 0; i < password.length; i++) {
	if (password.charAt(i) >= '0' && password.charAt(i) <= '9') hasNumber = true;
	if (password.charAt(i) >= 'a' && password.charAt(i) <= 'z') hasLowercaseLetter = true;
	if (password.charAt(i) >= 'A' && password.charAt(i) <= 'Z') hasUppercaseLetter = true;
    }
    if (!hasLowercaseLetter)
    {
	document.getElementById("loginResult").innerHTML = "Your password must have at least one lowercase letter.";
	return;
    }
    if (!hasUppercaseLetter)
    {
	document.getElementById("loginResult").innerHTML = "Your password must have at least one uppercase letter.";
	return;
    }
    if (!hasNumber)
    {		
	document.getElementById("loginResult").innerHTML = "Your password must have at least one number.";
	return;
    }

//    var passHash = md5(password);
    let tmp = {firstName:firstName, lastName:lastName, login:login, password:password};
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/Register.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
	xhr.onreadystatechange = function() 
	{
	    if (this.readyState == 4 && this.status == 200) 
	    {
		let jsonObject = JSON.parse( xhr.responseText );
		let errorMessage = jsonObject.error;
		if (errorMessage != "")
		{
		    if (jsonObject.error == "Login Already Exists!") document.getElementById("loginResult").innerHTML = "That username has been taken.<br /> Please use a different username.";
		    else document.getElementById("loginResult").innerHTML = errorMessage;
		    return;
		}
		document.getElementById("loginResult").innerHTML = "User successfully added. Please return to the login page to access your new contact manager!";
//		userId = jsonObject.id;
//		firstName = jsonObject.firstName;
//		lastName = jsonObject.lastName;
//		saveCookie();
	    }
	};
	xhr.send(jsonPayload);
    }
    catch(err)
    {
	document.getElementById("loginResult").innerHTML = err.message;
    }
    
    // Check if the login already exists
    // (Maybe) check if the password fulfills certain requirements
    // Add user data to the database
}


function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "home.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("displayName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}


