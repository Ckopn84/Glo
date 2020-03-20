'use strict';

const formSearch = document.querySelector('.form-search'),
	inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
	inputCitiesTo = formSearch.querySelector('.input__cities-to'),
	dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
	dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
	inputDateDepert = formSearch.querySelector('.input__date-depart');

const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
	calendar = 'http://min-prices.aviasales.ru/calendar_preload',
	dbCity = './dataBase/cities.json',
	proxy = 'https://cors-anywhere.herokuapp.com/',
	API_KEY = '140c8ae1872b0d7b6dd4512b38f16d46';

let city = [];

const getData = (url, callback) => {
	fetch(url)
		.then(response => {
			if (response.status !== 200) throw new Error(`Status network ${response.status}`);
			return response.json();
		})
		.then(data => callback(data))
		.catch(error => console.error(error));
};

const sortObj = (obj, parameter) => obj.sort((first, second) => (
	first[parameter] > second[parameter] ? 1 :
		first[parameter] < second[parameter] ? -1 : 0
));

const shownCity = (input, list) => {
	let cities = {};

	const filterCity = str => city.filter(item => {
		const fixItem = item.name.toLowerCase();
		return fixItem.substr(0, str.length) === str.toLowerCase() &&
		// return fixItem.includes(input.value.toLowerCase()) &&
			item.name.toLowerCase() !== inputCitiesFrom.value.toLowerCase();
	});

	list.textContent = '';
	input.value = input.value.replace(/[^а-я]/gi, '');

	do {
		cities = filterCity(input.value);
		if (cities.length === 0) input.value = input.value.substr(0, input.value.length - 1);
		console.log(cities.length, input.value);
	} while (cities.length === 0 && input.value.length > 0);

	if (input.value !== '') {
		sortObj(cities, 'name').forEach(item => {
			const li = document.createElement('li');

			li.classList.add('dropdown__city');
			li.textContent = item.name;

			list.append(li);
		});
	}
};

const renderCheapDay = cheapTicket => {
	console.log(cheapTicket);
};

const renderCheapYear = cheapTickets => {
	console.log(sortObj(cheapTickets, 'value'));
};

const renderCheap = (data, date) => {
	const cheapTicketYear = data.best_prices;
	const cheapTicketDay = cheapTicketYear.filter(item => item.depart_date === date);

	renderCheapDay(cheapTicketDay);
	renderCheapYear(cheapTicketYear);
};

const selectCity = (event, input, list) => {
	const { target } = event;

	if (target.tagName.toLowerCase() === 'li') {
		input.value = target.textContent;
		list.textContent = '';
	}
};

inputCitiesFrom.addEventListener('input', () => {
	shownCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
	shownCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', event => {
	selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', event => {
	selectCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener('submit', event => {
	event.preventDefault();

	const formData = {
		from: city.find(item => inputCitiesFrom.value === item.name).code,
		to: city.find(item => inputCitiesTo.value === item.name).code,
		when: inputDateDepert.value,
	};

	const requestData = '?origin=' + formData.from +
		'&destination=' + formData.to +
		'&depart_date=' + formData.when +
		'&one_way=true&token=' + API_KEY;

	// getData(proxy + calendar + requestData, data => {
	// 	renderCheap(data, formData.when);
	// });
	getData(calendar + requestData, data => {
		renderCheap(data, formData.when);
	});
});

getData(dbCity, data => {
	city = data.filter(item => item.name);
});
