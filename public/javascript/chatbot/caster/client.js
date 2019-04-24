// Start ws connection after document is loaded
$(document).ready(function () {

	// Connect if API_Key is inserted
	// Else show an error on the overlay
	if (typeof API_Key === "undefined") {
		$("body").html("No API Key found or load!<br>Rightclick on the script in ChatBot and select \"Insert API Key\"");
		$("body").css({ "font-size": "20px", "color": "#ff8080", "text-align": "center" });
	}
	else {
		connectWebsocket();
	}

});

// Connect to ChatBot websocket
// Automatically tries to reconnect on
// disconnection by recalling this method
function connectWebsocket() {

	//-------------------------------------------
	//  Create WebSocket
	//-------------------------------------------
	var socket = new WebSocket("ws://127.0.0.1:3337/streamlabs");

	//-------------------------------------------
	//  Websocket Event: OnOpen
	//-------------------------------------------
	socket.onopen = function () {
		// AnkhBot Authentication Information
		var auth = {
			author: "The_Alcoholic_Ninja",
			website: "alcoholicninja.com",
			api_key: API_Key,
			events: [
				"EVENT_USERNAME"
			]
		};

		// Send authentication data to ChatBot ws server

		socket.send(JSON.stringify(auth));
	};

	//-------------------------------------------
	//  Websocket Event: OnMessage
	//-------------------------------------------
	socket.onmessage = function (message) {
		// Parse message
		var socketMessage = JSON.parse(message.data);

		// EVENT_USERNAME
		if (socketMessage.event == "EVENT_USERNAME") {
			var eventData = JSON.parse(socketMessage.data);

			var testdata = $.getJSON({
				type: 'GET',
				url: 'https://api.twitch.tv/kraken/channels/' + eventData.user,
				headers: {
					'Client-ID': settings.APIKey
				},
				success: function (data) {
					$("#alert")
						.queue(function () {
							document.getElementById("displayName").style.color = settings.CasterColor;
							$("#displayName").html(eventData.user.toUpperCase());
							$("#logo").html("<img class=round src=\"" + data.logo + "\">");
							document.getElementById("twitch").style.color = settings.TwitchColor;
							$("#twitch").html(data.url);
							$("#sound").html("<embed src=\"" + settings.InSound + "\" hidden=\"true\" />");


							$(this).removeClass(settings.OutTransition + "Out initialHide");
							$(this).addClass(settings.InTransition + "In");
							$(this).dequeue();
						})
						.delay(settings.Duration * 1000)
						.queue(function () {
							$("#sound").html("<embed src=\"" + settings.OutSound + "\" hidden=\"true\" />");
							$(this).removeClass(settings.InTransition + "In");
							$(this).addClass(settings.OutTransition + "Out");
							$(this).dequeue();
						});
				}
			});



			// Queue animation

		}
	}

	//-------------------------------------------
	//  Websocket Event: OnError
	//-------------------------------------------
	socket.onerror = function (error) {
		console.log("Error: " + error);
	}

	//-------------------------------------------
	//  Websocket Event: OnClose
	//-------------------------------------------
	socket.onclose = function () {
		// Clear socket to avoid multiple ws objects and EventHandlings
		socket = null;
		// Try to reconnect every 5s 
		setTimeout(function () { connectWebsocket() }, 5000);
	}

};
