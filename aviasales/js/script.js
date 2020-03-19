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

/* const getData = (url, callback) => {
	const request = new XMLHttpRequest();

	request.open('GET', url);

	request.addEventListener('readystatechange', () => {
		if (request.readyState !== 4) return;

		if (request.status === 200) {
			callback(request.response);
		} else console.error(request.status);
	});

	request.send();
}; */

const getData = (url, callback) => {
	fetch(url)
		.then(response => {
			if (response.status !== 200) throw new Error(`Status network ${response.status}`);
			return response.json();
		})
		.then(data => callback(data))
		.catch(error => console.error(error));
};

const getPrice = (inputFrom, inputTo, departDate) => {
	inputFrom = inputFrom || 'Екатеринбург';
	inputTo = inputTo || 'Калининград';
	departDate = departDate || '2020-05-25';

	// const IATAFrom = city.filter(item => item.name === inputFrom);
	// const IATATo = city.filter(item => item.name === inputTo);
	const IATAFrom = 'SVX',
		IATATo = 'KGD';

	const url = calendar + '?origin=' + IATAFrom + '&destination=' + IATATo +
		'&depart_date=' + departDate + '&one_way=true';

	getData(url, data => console.log(data.best_prices.filter(item => item.depart_date === departDate)));
};

const shownCity = (input, list) => {
	list.textContent = '';

	if (input.value !== '') {
		const filterCity = city.filter(item => {
			const fixItem = item.name.toLowerCase();
			return fixItem.includes(input.value.toLowerCase()) &&
				item.name.toLowerCase() !== inputCitiesFrom.value.toLowerCase();
		});

		filterCity.forEach(item => {
			const li = document.createElement('li');

			li.classList.add('dropdown__city');
			li.textContent = item.name;

			list.append(li);
		});
	}
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

// getData(proxy + citiesApi, data => {
// 	city = data.filter(item => item.name);
// });

getData(dbCity, data => {
	city = data.filter(item => item.name);
});

getPrice(inputCitiesFrom.value.trim(), inputCitiesTo.value.trim(), inputDateDepert.value.trim());
