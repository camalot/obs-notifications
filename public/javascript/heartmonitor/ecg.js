	(function ($) {
		$(function () {
			var low = 30;
			var smoothie = new SmoothieChart({
				responsive: true,
				minValue: low - 5,
				maxValue: 100,
				scaleSmoothing: 0.125,
				maxValueScale: 1,
				minValueScale: 1,
				grid: {
					strokeStyle: 'rgb(0, 0, 0,0)', fillStyle: 'rgb(0, 0, 0,0)',
					lineWidth: 1, millisPerLine: 250, verticalSections: 6,
				},
				labels: { fillStyle: 'rgb(0, 0, 0, 0)' }
			});
			smoothie.streamTo(document.getElementById("ecg-smoothie"));
			var ecgData = new TimeSeries();
			smoothie.addTimeSeries(ecgData, { strokeStyle: 'rgb(255, 0, 0, 0.5)', fillStyle: 'rgba(255, 0, 0, 0)', lineWidth: 16 });



			var socket = new WebSocket("ws://192.168.2.3:3880");
			socket.onopen = function (e) {
				console.log('Connected to server!');
				ecgData.append(new Date().getTime(), low);
			};
			socket.onclose = function (e) {
				console.log('Disconnected from server');
				ecgData.append(new Date().getTime(), low);
			};
			socket.onmessage = function (e) {
				var data = JSON.parse(e.data);
				if (data.bpm) {
					console.log(data.bpm);
					if (ecgData) {
						ecgData.append(new Date().getTime(), data.bpm);
						ecgData.append(new Date().getTime() + 50, low);

					}
				}
			};
			socket.onerror = function (e) {
				console.log('An error has occurred!\n' + e.message);
			};
		});
	})(jQuery);
