'use strict';

const formSearch = document.querySelector('.form-search'),
	inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
	inputCitiesTo = formSearch.querySelector('.input__cities-to'),
	dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
	dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
	inputDateDepert = formSearch.querySelector('.input__date-depart'),
	cheapestTicket = document.getElementById('cheapest-ticket'),
	otherCheapTickets = document.getElementById('other-cheap-tickets');

const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
	calendar = 'http://min-prices.aviasales.ru/calendar_preload',
	dbCity = './dataBase/cities.json',
	proxy = 'https://cors-anywhere.herokuapp.com/',
	API_KEY = '140c8ae1872b0d7b6dd4512b38f16d46',
	MAX_COUNT = 10;

let city = [];

const getData = (url, callback, reject = console.error) => {
	fetch(url)
		.then(response => {
			if (response.status !== 200) throw new Error(response.status);
			return response.json();
		})
		.then(data => callback(data))
		.catch(error => reject(error));
};

const sortObj = (obj, parameter) => obj.sort((first, second) => (
	first[parameter] > second[parameter] ? 1 :
		first[parameter] < second[parameter] ? -1 : 0
));

const shownCity = (input, list) => {
	let cities = {};

	const filterCity = str => city.filter(item => {
		const fixItem = item.name.toLowerCase();
		// return fixItem.substr(0, str.length) === str.toLowerCase() &&
		return fixItem.startsWith(str.toLowerCase()) &&
		// return fixItem.includes(input.value.toLowerCase()) &&
			item.name.toLowerCase() !== inputCitiesFrom.value.toLowerCase();
	});

	list.textContent = '';
	input.value = input.value.replace(/[^а-я]/gi, '');

	do {
		cities = filterCity(input.value);
		if (cities.length === 0) input.value = input.value.substr(0, input.value.length - 1);
	} while (cities.length === 0 && input.value.length > 0);

	if (input.value !== '') {
		cities.forEach(item => {
			const li = document.createElement('li');

			li.classList.add('dropdown__city');
			li.textContent = item.name;

			list.append(li);
		});
	}
};

const cityFind = (data, parameter) => city.find(item => data === item[parameter]);

const getDate = date => {
	return new Date(date).toLocaleString('ru', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

const getChanges = num => (num ? `Пересадок: ${num}` : 'Без пересадок');

const getLinkAviasales = data => {
	let link = 'https://www.aviasales.ru/search/';
	const date = data.depart_date.split('-');

	link += data.origin + date[2] + date[1] + data.destination + '1';
	// SVX2905KGD1
	return link;
};

const createCard = data => {
	const ticket = document.createElement('article');

	ticket.classList.add('ticket');

	let deep = '';

	if (data) {
		deep = `
		<h3 class="agent">${data.gate}</h3>
		<div class="ticket__wrapper">
			<div class="left-side">
				<a href="${getLinkAviasales(data)}" target="_blank" class="button button__buy">Купить
					за ${data.value}₽</a>
			</div>
			<div class="right-side">
				<div class="block-left">
					<div class="city__from">Вылет из города
						<span class="city__name">${cityFind(data.origin, 'code').name}</span>
					</div>
					<div class="date">${getDate(data.depart_date)}</div>
				</div>

				<div class="block-right">
					<div class="changes">${getChanges(data.number_of_changes)}</div>
					<div class="city__to">Город назначения:
						<span class="city__name">${cityFind(data.destination, 'code').name}</span>
					</div>
				</div>
			</div>
		</div>
`;
	} else {
		deep = '<h3>К сожалению, на текущую дату билетов не нашлось!</h3>';
	}

	ticket.insertAdjacentHTML('afterbegin', deep);

	return ticket;
};

const renderCheapDay = cheapTicket => {
	cheapestTicket.style.display = 'block';
	cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
	cheapestTicket.append(createCard(cheapTicket[0]));
};

const renderCheapYear = cheapTickets => {
	otherCheapTickets.style.display = 'block';
	otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';

	sortObj(cheapTickets, 'value');

	for (let i = 0; i < MAX_COUNT && i < cheapTickets.length; i++) {
		otherCheapTickets.append(createCard(cheapTickets[i]));
	}
	console.log(cheapTickets);
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

	const showAlert = elem => {
		alert('Некорректное название города: ' + elem.value);
	};

	const formData = {
		from: cityFind(inputCitiesFrom.value, 'name'),
		to: cityFind(inputCitiesTo.value, 'name'),
		when: inputDateDepert.value,
	};

	if (!formData.from) {
		showAlert(inputCitiesFrom);
	} else if (!formData.to) {
		showAlert(inputCitiesTo);
	} else {
		const requestData = '?origin=' + formData.from.code +
			'&destination=' + formData.to.code +
			'&depart_date=' + formData.when +
			'&one_way=true&token=' + API_KEY;

		// getData(proxy + calendar + requestData, data => {
		// 	renderCheap(data, formData.when);
		// });
		getData(calendar + requestData, data => {
			renderCheap(data, formData.when);
		});
	}
});

getData(dbCity, data => {
	city = sortObj(data.filter(item => item.name), 'name');
});
