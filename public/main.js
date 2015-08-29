
// when the document is loaded, get the username on top of the webpage!
$(document).ready(function() {
	var userName = getUrlVars()['user'];
	var real_userName = capFirstLetter(userName);
	$("#header").append("Welcome, " + real_userName +"!");
});

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