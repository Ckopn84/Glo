'use strict';
/* Воркшоп по JS. Калькулятор верстки
18.02.2020 - 21.02.2020
Максим Лескин
GloAcademy
*/

const DATA = {
    whichSite: ['landing', 'multiPage', 'onlineStore'],
    price: [4000, 8000, 26000],
    desktopTemplates: [50, 40, 30],
    adapt: 20,
    mobileTemplates: 15,
    editable: 10,
    metrikaYandex: [500, 1000, 2000],
    analyticsGoogle: [850, 1350, 3000],
    sendOrder: 500,
    deadlineDay: [[2, 7], [3, 10], [7, 14]],
    deadlinePercent: [20, 17, 15]
};

const startButton = document.querySelector('.start-button'),
    firstScreen = document.querySelector('.first-screen'),
    mainForm = document.querySelector('.main-form'),
    formCalculate = document.querySelector('.form-calculate'),
    endButton = document.querySelector('.end-button'),
    total = document.querySelector('.total'),
    fastRange = document.querySelector('.fast-range'),
    totalPriceSum = document.querySelector('.total_price__sum'),
    adapt = document.querySelector('#adapt'),
    mobileTemplates = document.querySelector('#mobileTemplates'),
    desktopTemplates = document.querySelector('#desktopTemplates'),
    editable = document.querySelector('#editable'),
    adaptValue = document.querySelector('.adapt_value'),
    mobileTemplatesValue = document.querySelector('.mobileTemplates_value'),
    desktopTemplatesValue = document.querySelector('.desktopTemplates_value'),
    editableValue = document.querySelector('.editable_value'),
    typeSite = document.querySelector('.type-site'),
    maxDeadline = document.querySelector('.max-deadline'),
    rangeDeadline = document.querySelector('.range-deadline'),
    deadlineValue = document.querySelector('.deadline-value'),
    calcDescription = document.querySelector('.calc-description'),
    metrikaYandex = document.querySelector('#metrikaYandex'),
    analyticsGoogle = document.querySelector('#analyticsGoogle'),
    sendOrder = document.querySelector('#sendOrder'),
    cardHead = document.querySelector('.card-head'),
    totalPrice = document.querySelector('.total_price'),
    firstFieldset = document.querySelector('.first-fieldset');

const showElem = elem => {
    elem.style.display = 'block';
};

const hideElem = elem => {
    elem.style.display = 'none';
};

const changeEnding = (num, textVariant) => {
    const n1 = num % 100,
        n2 = num % 10;
    return num + textVariant[(n1 > 9 && n1 < 21) || (n2 > 4 && n2 < 10) ? 2 :
        n2 === 1 ? 0 :
        n2 > 1 && n2 < 5 ? 1 : 2];
};

const dopOptionsString = () => {
    // Подключим Яндекс Метрику, Гугл Аналитику и отправку заявок на почту.
    let arr = [];
    if (metrikaYandex.checked) { arr.push(' Яндекс Метрику'); }
    if (analyticsGoogle.checked) { arr.push(' Гугл Аналитику'); }
    if (sendOrder.checked) { arr.push(' отправку заявок на почту'); }
    let str = '';
    if (arr.length > 0) {
        str = 'Подключим';
        str += arr.length === 1 ? arr[0] : arr.length === 2 ? arr[0] + ' и ' + arr[1] :
            arr[0] + ', ' + arr[1] + ' и ' + arr[2];
        str += '.';
    }
    return str;
};

const renderTextContent = (total, site, maxDay, minDay) => {
    totalPriceSum.textContent = total;
    typeSite.textContent = site;
    maxDeadline.textContent = changeEnding(maxDay, [' дня', ' дней', ' дней']);
    rangeDeadline.min = minDay;
    rangeDeadline.max = maxDay;
    deadlineValue.textContent = changeEnding(rangeDeadline.value, [' днень', ' дня', ' дней']);

    adaptValue.textContent = adapt.checked ? 'Да' : 'Нет';
    mobileTemplatesValue.textContent = mobileTemplates.checked ? 'Да' : 'Нет';
    desktopTemplatesValue.textContent = desktopTemplates.checked ? 'Да' : 'Нет';
    editableValue.textContent = editable.checked ? 'Да' : 'Нет';

    calcDescription.textContent = `
    Сделаем ${site}${adapt.checked ? ', адаптированный под мобильные устройства и планшеты' :
    ''}. ${editable.checked ? 'Установим панель админстратора, чтобы вы могли ' + 
    'самостоятельно менять содержание на сайте без разработчика. ' : ''}${dopOptionsString()}`;
};

const priceCalculation = elem => {
    let result = 0,
        index = 0,
        options = [],
        site = '',
        maxDedlineDay = DATA.deadlineDay[index][1],
        mixDedlineDay = DATA.deadlineDay[index][0],
        overPercent = 0;

    if (elem.name === 'whichSite') {
        for (const item of formCalculate.elements) {
            if (item.type === 'checkbox') {
                item.checked = false;
            }
        }
        hideElem(fastRange);
        mobileTemplates.disabled = true;
    }
    
    if (elem.id === 'adapt') {
        mobileTemplates.checked = false;
        mobileTemplates.disabled = !adapt.checked;
    }
    
    for (const item of formCalculate.elements) {
        if (item.name === 'whichSite' && item.checked) {
            index = DATA.whichSite.indexOf(item.value);
            site = item.dataset.site;
            maxDedlineDay = DATA.deadlineDay[index][1];
            mixDedlineDay = DATA.deadlineDay[index][0];
        } else if (item.classList.contains('calc-handler') && item.checked) {
            options.push(item.value);
        } else if (item.classList.contains('want-faster') && item.checked) {
            const overDay = maxDedlineDay - rangeDeadline.value;
            overPercent = overDay * (DATA.deadlinePercent[index] / 100);
        }
    }

    /* if (elem.classList.contains('calc-handler')) {
        console.log(elem);
        elem.parentElement.children[2].textContent = elem.checked ? 'Да' : 'Нет';
        // elem.nextElementSibling.nextElementSibling.textContent = elem.checked ? 'Да' : 'Нет';
    } */

    result += DATA.price[index];

    options.forEach(key => {
        if (typeof(DATA[key]) === 'number') {
            result += key === 'sendOrder' ?
            DATA[key] :
            result += DATA.price[index] * DATA[key] / 100;
        } else {
            result += key === 'desktopTemplates' ?
            DATA.price[index] * DATA.desktopTemplates[index] / 100 :
            DATA[key][index];
        }
    });

    result += result * overPercent;

    renderTextContent(result, site, maxDedlineDay, mixDedlineDay);
};

const handlerCallBackForm = event => {
    const target = event.target;

    if (target.classList.contains('want-faster')) {
        target.checked ? showElem(fastRange) : hideElem(fastRange);
        priceCalculation(target);
    }

    if (target.classList.contains('calc-handler')) {
        priceCalculation(target);
    }
};

const moveBackTotal = () => {
    if (document.documentElement.getBoundingClientRect().bottom > document.documentElement.clientHeight + 100) {
        totalPrice.classList.remove('totalPriceBottom');
        firstFieldset.after(totalPrice);
        window.removeEventListener('scroll', moveBackTotal);
        window.addEventListener('scroll', moveTotal);
    }
};

const moveTotal = () => {
    if (document.documentElement.getBoundingClientRect().bottom < document.documentElement.clientHeight + 100) {
        totalPrice.classList.add('totalPriceBottom');
        endButton.before(totalPrice);
        window.removeEventListener('scroll', moveTotal);
        window.addEventListener('scroll', moveBackTotal);
    }
};

const renderResponse = response => {
    if (response.ok) {
        hideElem(total);

        cardHead.textContent = 'Заявка на разработку сайта была отправлена!!! Мы скорос вами свяжемся!';
        cardHead.style.color = '#00cc00';
    }
};

startButton.addEventListener('click', () => {
    showElem(mainForm);
    hideElem(firstScreen);

    window.addEventListener('scroll', moveTotal);
});

endButton.addEventListener('click', () => {
    for (const elem of formCalculate.elements) {
        if (elem.tagName.toLocaleLowerCase() === 'fieldset') {
            hideElem(elem);
        }
    }

    cardHead.textContent = 'Заявка на разработку сайта';

    hideElem(totalPrice);

    showElem(total);
});

formCalculate.addEventListener('change', handlerCallBackForm);

formCalculate.addEventListener('submit', event => {
    event.preventDefault();

    const data = new FormData(event.target);

    fetch('./server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        body: data
    })
        .then(renderResponse)
        .catch(error => console.log(error));
});

priceCalculation(adapt);
