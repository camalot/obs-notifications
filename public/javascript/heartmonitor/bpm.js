(function ($) {
	$(function () {
		const SOCKET_ENDPOINT = "ws://192.168.2.3:3880";
		let reconnectPointer = null;
		let socket;

		function _startWS(socketAddress) {

			socket = new WebSocket(socketAddress);
			socket.onopen = function (e) {
				console.log('Connected to server!');
				$(".hms-value").empty();
			};
			socket.onclose = function (e) {
				$(".hms-value").empty();
				console.log('Disconnected from server');
				clearTimeout(reconnectPointer);
				console.log("Reconnect attempt in 5 seconds.");
				socket = null;
				reconnectPointer = setTimeout(() => {
					console.log("Attempting to reconnect...");
					_startWS(socketAddress);
				}, 5000);
			};
			socket.onmessage = function (e) {
				console.log(e);
				let payload = JSON.parse(e.data);
				switch (payload.event) {
					case "bpm":
						if (payload.data.bpm) {
							$(".hms-value").html(payload.data.bpm);
						} else {
							$(".hms-value").empty();
						}
						break;
					case "error":
						if(payload.message) {
							console.error(payload.data.message);
							console.error(payload.data.stack);
						}
						break;
				}
			};
			socket.onerror = function (e) {
				console.error('An error has occurred!\n' + e.message);
			};
		}

		_startWS(SOCKET_ENDPOINT);
	});
})(jQuery);
