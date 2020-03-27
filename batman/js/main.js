'use strict';

$(document).ready(() => {
	const tabsItem = $('.tabs-item');

	tabsItem.on('click', event => {
		event.preventDefault();
		// console.log($(this).attr('href')); // вывод в консоль атрибта href текущего элемента (по которому кликнули)
		const activeContent = $(event.target).attr('href');
		$('.visible').toggleClass('visible');
		$(activeContent).toggleClass('visible');
		$('.tabs-item-active').toggleClass('tabs-item-active');
		$(event.target).toggleClass('tabs-item-active');
	});
});
