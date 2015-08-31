// run AJAX request first before document is even loaded
// Logged username is obtained first before document is ready

var userName;	// logged user

$.ajax({
  	url: 'http://localhost:8888/secret',
  	type: 'GET',
  	success: function(data)
    {
    	$(document).ready(function() {
			userName = data['user'];
			var real_userName = capFirstLetter(userName);
			$("#header").append(real_userName +"!");
    	});
    	
    },
    error: function(jqXHR, textStatus, errorThrown)
    {
   		alert("Failed to get logged in username");
    }
});

function logoutClick() {

	// logout AJAX GET request
	$.ajax({
       url: 'http://localhost:8888/logout',
       type: 'GET',
       success: function(data)
       {
       		// if the user data is matched with that in the database,
       		// wait for three seconds until you move on to the next page
       		if(data["result"] == true)
       		{
       			var real_userName = capFirstLetter(userName);
       			alert("Good Bye, " + real_userName + ".");
       			setTimeout(function() {
       				window.open('http://localhost:8888/login.html','_self', false);
       			}, 500);
       		}
       }
	});
}

function showDiv(id) {

	var arr = ["main-body", "state_info", "msg_info"];

	for (var i = 0; i < arr.length ; i++) {
		if (arr[i] == id)
			$("#"+arr[i]).show();
		else
			$("#"+arr[i]).hide();
	}
}

function bodyEraser(id) {
	var myNode = document.getElementById(id);
	while (myNode.firstChild) {
	    myNode.removeChild(myNode.firstChild);
	}
}

// function when clicked on Home menu
function homeClick() {

	if ($("#home").hasClass("current-item") == false)
	{
		// add class to $("#home"), delete for others
		$("#states").removeClass();
		$("#msgs").removeClass();
		$("#home").addClass("current-item");

		showDiv("main-body");
	}
}

// function when clicked on State menu
function stateClick() {

	if ($("#states").hasClass("current-item") == false)
	{
		// add class to $("#states"), delete for others
		$("#home").removeClass();
		$("#msgs").removeClass();
		$("#states").addClass("current-item");

		showDiv("state_info");
	}

	// if the dropdown is not present,
	// create a new div and generate a dropdown menu for states
	if (document.getElementById('dropdown') === null)
	{
		// get the state_info div box
		var stateDiv = document.getElementById('state_info');

		// create listbox Object
		var div = document.createElement('div');
		div.id = 'dropdown';
		div.innerHTML = "<h2>States browser</h2>" + "<p>";

		if (stateDiv.firstChild)
			stateDiv.insertBefore(div, stateDiv.firstChild);
		else
			stateDiv.appendChild(div);
		
		// create dropdown box
		var select = document.createElement('select');
		select.id = 'stateList';
		document.getElementById("dropdown").appendChild(select);
		
		// get the list of States in the dropdown menu
		$.ajax({
	       url: 'http://localhost:8888/states/abbreviations',
	       type: 'GET',
	       success: function(data)
	       {
	       		// will obtain list of states
	       		for (var i = 0; i < data.length; i++) {
	       			// create a <option> for each one, and set its value to its state name
	       			var listItem = document.createElement("option");
	       			listItem.setAttribute("value", data[i]);
	       			listItem.innerHTML = data[i];

	       			document.getElementById("stateList").appendChild(listItem);
	       		}

	       		$( "select" ).change( displayStateInfo );
	       		displayStateInfo();
	       },
	       error: function(jqXHR, textStatus, errorThrown)
	       {
	       		alert("Failed to load states data!");
	       }
		});
	}
}

function displayStateInfo() {
  var stateVal = $( "#stateList" ).val();
  
  // get specific state info using stateVal
  $.ajax({
  	url: 'http://localhost:8888/states/' + stateVal,
  	type: 'GET',
  	success: function(data)
    {
    	// get each state's data
    	eachStateInfo(data);
    },
    error: function(jqXHR, textStatus, errorThrown)
    {
   		alert("Failed to load state's data!");
    }
  });
}

function eachStateInfo(json) {
	// erase the state_info div
	bodyEraser("state_detail");

	// div of state_info will display each state information
	// based on the JSON object received
	$("#state_detail").append(json['name']);
	$("#state_detail").append(', ' + json['abbreviation'] + '<br>');
	$("#state_detail").append('Capital: ' + json['capital'] + '<br>');

	// add commas for better visibility
	var population = commaEmplacer(JSON.stringify(json['population']));
	var sq_miles = commaEmplacer(JSON.stringify(json['square-miles']));

	$("#state_detail").append('Most populous city: ' + json['most-populous-city'] + '<br>');
	$("#state_detail").append('Population: ' + population + '<br>');
	$("#state_detail").append('Size of the state: ' + sq_miles + ' (miles)^2<br>');
	$("#state_detail").append('Timezone 1: ' + json['time-zone-1'] + '<br>');
	if (json['time-zone-2'] !== "")
	{
		$("#state_detail").append('Timezone 2: ' + json['time-zone-2'] + '<br>');
	}
	$("#state_detail").append('Daylight Saving Time? ' + json['dst']);
}

// function when clicked on Messages menu
function msgClick() {

	if ($("#msgs").hasClass("current-item") == false)
	{
		// add class to $("#msgs"), delete for others
		$("#home").removeClass();
		$("#states").removeClass();
		$("#msgs").addClass("current-item");

		showDiv("msg_info");
	}

	// get the msg_info div box
	var msgDiv = document.getElementById('msg_info');

	// check if msg_left box present; if not, create one
	if (document.getElementById('msg_left') === null)
	{
		// create msg_left div box
		var msg_left = document.createElement('div');
		msg_left.id = "msg_left";
		msg_left.style = "width: 40%; float:left";

		// create message show buttons
		createMsgButtons(msg_left);

		// append msg_left div as a child of msg_info
		msgDiv.appendChild(msg_left);

	}

	// check if msg_to_add box is present; if not, create one
	if (document.getElementById('msg_to_add') === null)
	{
		// create msg_to_add div box
		var msg_to_add = document.createElement('div');
		msg_to_add.id = "msg_to_add";
		msg_to_add.style = "width: 60%; float:right";

		// create field form for message add feature
		createMsgAddFeature(msg_to_add);

		// append msg_to_add as a child of msg_info
		msgDiv.appendChild(msg_to_add);
	}

}

function createMsgButtons(msg_left) {

	// button for showing all messages
	var button1 = document.createElement('button');
	button1.setAttribute("type", "submit");
	button1.setAttribute("id", "allMsgs");
	button1.setAttribute("onclick", "allMsgs();");
	button1.innerHTML = "All messages";

	// button for showing my messages only
	var button2 = document.createElement('button');
	button2.setAttribute("type", "submit");
	button2.setAttribute("id", "myMsgs");
	button2.setAttribute("onclick", "myMsgs();");
	button2.innerHTML = "My messages";

	// button for showing my secret messages
	var button3 = document.createElement('button');
	button3.setAttribute("type", "submit");
	button3.setAttribute("id", "mySecretMsgs");
	button3.setAttribute("onclick", "mySecretMsgs();");
	button3.innerHTML = "My secret messages";

	// empty div with id = "msg_show" to 
	var msg = document.createElement('div');
	msg.id = "msg_show";

	// append them as children of msg_left
	msg_left.appendChild(button1);
	msg_left.appendChild(button2);
	msg_left.appendChild(button3);
	msg_left.appendChild(document.createElement('p'));	// indent
	msg_left.appendChild(msg);
}

function allMsgs() {
	// get all messages left using AJAX GET request
	$.ajax({
	  	url: 'http://localhost:8888/read',
	  	type: 'GET',
	  	success: function(data)
	    {
	    	// data is an array of JSON objects
	    	/* 
	    		[
	    			{"user": USER1, "phone": xxx xxx xxxx, "message": MESSAGE},
					{"user": USER2, "phone": xxx xxx xxxx, "message": MESSAGE},
					...
				]
	    	*/

	    	// clear msg_show div in order to fill it up with ALL Messages
	    	document.getElementById("msg_show").innerHTML = "";

	    	var msg_string = "";
	    	for (var i = 0; i < data.length; i++) {
	    		msg_string += "User: " + data[i]["user"] 
	    				    + "<br>Phone #: " + data[i]["phone"]
	    				    + "<br>Message: " + data[i]["message"];
	    		msg_string += "<br><br>";
	    	}

	    	// display it in HTML
		    msg_show.innerHTML = msg_string;
	    },
	    error: function(jqXHR, textStatus, errorThrown)
	    {
	   		alert("Failed to load message(s) left!");
	    }
	});
}

function myMsgs() {
	// get my specific messages left using AJAX GET request
	$.ajax({
	  	url: 'http://localhost:8888/read',
	  	type: 'GET',
	  	success: function(data)
	    {
	    	// data is an array of JSON objects
	    	/* 
	    		[
	    			{"user": USER1, "phone": xxx xxx xxxx, "message": MESSAGE},
					{"user": USER2, "phone": xxx xxx xxxx, "message": MESSAGE},
					...
				]
	    	*/

	    	// clear msg_show div in order to fill it up with ALL Messages
	    	document.getElementById("msg_show").innerHTML = "";

	    	var msg_string = "<h2>My messages: </h2>";

	    	var count = 0;
	    	for (var i = 0; i < data.length; i++) {

	    		if (userName == data[i]["user"]) {
		    		msg_string += "Phone #: " + data[i]["phone"]
		    				    + "<br>Message: " + data[i]["message"];
		    		msg_string += "<br><br>";
		    		count++;
		    	}
	    	}

	    	if ( count == 0) {
	    		msg_string += "None";
	    	}
		    
		    // display it in HTML
		    msg_show.innerHTML = msg_string;
		    	
	    },
	    error: function(jqXHR, textStatus, errorThrown)
	    {
	   		alert("Failed to load message(s) left!");
	    }
	});
}

function mySecretMsgs() {
	// get my secret messages left using AJAX GET request
	$.ajax({
	  	url: 'http://localhost:8888/secret',
	  	type: 'GET',
	  	success: function(data)
	    {
	    	// clear msg_show div in order to fill it up with ALL Messages
	    	document.getElementById("msg_show").innerHTML = "";

	    	var msg_string = "";

    		msg_string += "Secret Message: " + data["message"];
    		msg_string += "<br><br>";

	    	// display it in HTML
		    msg_show.innerHTML = msg_string;
		    	
	    },
	    error: function(jqXHR, textStatus, errorThrown)
	    {
	   		alert("Failed to load message(s) left!");
	    }
	});
}

function createMsgAddFeature(msg_to_add) {

	// create phone number field
	var phoneField = document.createElement('input');
	phoneField.setAttribute("id", "phoneNum");
	phoneField.setAttribute("type", "text");
	phoneField.setAttribute("size", "15");
	phoneField.setAttribute("placeholder", "Phone #: xxx xxx xxxx");
	phoneField.innerHTML = "Enter Phone #: ";

	// create message field
	var msgField = document.createElement('textarea');
	msgField.setAttribute("id", "msgLeft");
	msgField.setAttribute("type", "text");
	msgField.setAttribute("placeholder", "Leave your message here..");
	msgField.setAttribute("rows", "7");
	msgField.setAttribute("cols", "40");

	// create submit button
	var submitButton = document.createElement('button');
	submitButton.setAttribute("type", "submit");
	submitButton.setAttribute("id", "leaveMsgButton");
	submitButton.setAttribute("onclick", "leaveMsg();");
	submitButton.innerHTML = "Submit";

	// add all these feature to msg_to_add
	msg_to_add.appendChild(phoneField);
	msg_to_add.appendChild(document.createElement('p'));	// indent
	msg_to_add.appendChild(msgField);
	msg_to_add.appendChild(document.createElement('p'));	// indent
	msg_to_add.appendChild(submitButton);

}

function leaveMsg() {

	var phoneNum = $("#phoneNum").val();
	phoneNum = phoneNum == "" ? undefined : phoneNum;
	var msg = $("#msgLeft").val();
	msg = msg == "" ? undefined : msg;
	var json = {'phone':phoneNum,'message':msg};

	// POST my message
	$.ajax({
	  	url: 'http://localhost:8888/write',
	  	type: 'POST',
	  	contentType:'application/json',
	  	data: JSON.stringify(json),
	  	dataType:'json',
	  	success: function(data)
	    {
	    	alert("Message Left!");
		    	
	    },
	    error: function(jqXHR, textStatus, errorThrown)
	    {
	    	if (jqXHR['status'] == 401)
	   			alert("User, " + userName + ", is not logged on!");
	   		else if (jqXHR['status'] == 400)
	   			alert("You must enter both phone number and message fields!");
	    }
	});
}

function commaEmplacer(str) {
	var new_str = "";
	var len = str.length;
	var mod = len % 3;
	for (var i = 0; i < len ; i++) {

		if (i == 0)
			new_str += str[i];
		else if (i % 3 == mod)
			new_str += "," + str[i];
		else
			new_str += str[i];
	}

	return new_str;
}

function capFirstLetter(name)
{
	return name.charAt(0).toUpperCase() + name.slice(1);
}