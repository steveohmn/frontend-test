 $("#login-button").click(function(event){
	event.preventDefault();

	var username = $("#username").val();
	var password = $("#password").val();
	var data = {'user':username,'password':password};

	//var response = '';

	$.ajax({
       url: 'http://localhost:8888/login',
       type: 'POST',
       contentType:'application/json',
       data: JSON.stringify(data),
       dataType:'json',
       success: function(data)
       {
       		// if the user data is matched with that in the database,
       		// wait for three seconds until you move on to the next page
       		if(data["result"] == true)
       		{
       			$('form').fadeOut(500);
       			$('.wrapper').addClass('form-success');

       			setTimeout(function() {
       				window.open('http://localhost:8888/main.html?'+'user='+username, '_self', false);
       			}, 3000);
       		}
       		
       },
       error: function(jqXHR, textStatus, errorThrown)
       {
       		alert("Failed to login!");
       }
	});

});