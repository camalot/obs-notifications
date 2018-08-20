'use strict';
(($,settings) => {
	$(function () {
		// Load Social Network Names
		$('.popup .right span').each(function () {
			let $this = $(this);
			let socialName = settings.social[$this.data('name')];
			$this.append(socialName);
		});

		// Load Social Popup
		$('.popup').each(function () {
			let $this = $(this);
			let supporterEnable = settings.popup[$this.data('box')],
				boxName = $this.data('box');

			if (supporterEnable == 1) {
				$(`input[name=${boxName}]`).prop('checked', true);
				$this.addClass('animate-popup');
			} else if (supporterEnable === 0) {
				$(`input[name=${boxName}]`).prop('checked', false);
				$this.addClass('no-popup');
			} else {
				return false;
			}
		});

		// Animate Popup

		let popups = $('.animate-popup');
		let i = 0;
		let pT = settings.popup.pauseTime * 1000;

		function animatePopup() {
			if (i >= popups.length) {
				i = 0;
			}
			popups.eq(i).addClass('show-popup')
			.delay(settings.popup.aTime * 1000)
			.queue(function () {
					let $this = $(this);
					$this.removeClass('show-popup');
					$this.dequeue();
					if (i == popups.length) {
						setTimeout(animatePopup, pT);
					} else {
						animatePopup();
					}
				});
			i++;
		}
		animatePopup();
	});
})(jQuery, settings);
