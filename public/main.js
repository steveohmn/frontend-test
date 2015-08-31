
// when the document is loaded, get the username on top of the webpage!
$(document).ready(function() {
	// get the username to display on the header
	var userName = getUrlVars()['user'];
	var real_userName = capFirstLetter(userName);
	$("#header").append(real_userName +"!");
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
       			alert("logout successful!");
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

function msgClick() {

	if ($("#msgs").hasClass("current-item") == false)
	{
		// add class to $("#msgs"), delete for others
		$("#home").removeClass();
		$("#states").removeClass();
		$("#msgs").addClass("current-item");

		showDiv("msg_info");
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
   		$.when( eachStateInfo(data) )
   		 .done(
   		 	function()
   		 	{
   		 		
   		 	}
   		 );
    },
    error: function(jqXHR, textStatus, errorThrown)
    {
   		alert("Failed to load state's data!");
    }
  })
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

// Read a page's URL query variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function capFirstLetter(name)
{
	return name.charAt(0).toUpperCase() + name.slice(1);
}