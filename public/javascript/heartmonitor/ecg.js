(function ($) {
	$(function () {
		const SOCKET_ENDPOINT = "ws://192.168.2.3:3880";
		let reconnectPointer = null;
		let socket;
		let ecgData = new TimeSeries();
		
		let diff = Date.now() - new Date("04/01/1977").getTime();
		let ageDate = new Date(diff);
		let age = Math.abs(ageDate.getUTCFullYear() - 1970);
		let low = 20;

		function _startWS(socketAddress) {

			socket = new WebSocket(socketAddress);
			socket.onopen = function (e) {
				console.log('Connected to server!');
				ecgData.append(new Date().getTime(), low);
			};
			socket.onclose = function (e) {
				console.log('Disconnected from server');
				ecgData.append(new Date().getTime(), low);

				clearTimeout(reconnectPointer);
				console.log("Reconnect attempt in 5 seconds.");
				socket = null;
				reconnectPointer = setTimeout(() => {
					console.log("Attempting to reconnect...");
					_startWS(socketAddress);
				}, 5000);
			};
			socket.onmessage = function (e) {
				let data = JSON.parse(e.data);
				if (data.bpm) {
					console.log(data.bpm);
					if (ecgData) {
						ecgData.append(new Date().getTime() - 200, low);
						ecgData.append(new Date().getTime(), data.bpm);
						ecgData.append(new Date().getTime() + 200, low);
					}
				}
			};
			socket.onerror = function (e) {
				console.error('An error has occurred!\n' + e.message);
			};
		}

		function _initSmoothie() {

			let smoothie = new SmoothieChart({
				responsive: true,
				minValue: 0,
				//maxValue: 220 - (age + 5),
				maxValue: 120,
				scaleSmoothing: 0.125,
				maxValueScale: 1,
				minValueScale: 1,
				grid: {
					strokeStyle: 'rgb(0, 0, 0, 0)',
					fillStyle: 'rgb(0, 0, 0, 0)',
					lineWidth: 1,
					millisPerLine: 1000,
					verticalSections: 0,
				},
				labels: {
					fillStyle: 'rgb(0, 0, 0, 0)'
				}
			});
			smoothie.streamTo(document.getElementById("ecg-smoothie"));
			smoothie.addTimeSeries(ecgData, {
				strokeStyle: 'rgb(255, 0, 0, 0.5)',
				fillStyle: 'rgba(255, 0, 0, 0)',
				lineWidth: 15
			});
		}

		_initSmoothie();
		_startWS(SOCKET_ENDPOINT);

	});
})(jQuery);
