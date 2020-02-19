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
    mobileTemplates = document.querySelector('#mobileTemplates');

const showElem = elem => {
    elem.style.display = 'block';
};

const hideElem = elem => {
    elem.style.display = 'none';
};

const priceCalculation = elem => {
    let result = 0,
        index,
        options = [];

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
        } else if (item.classList.contains('calc-handler') && item.checked) {
            options.push(item.value);
        }
    }

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

    result += DATA.price[index];

    totalPriceSum.textContent = result;
};

const handlerCallBackForm = event => {
    const target = event.target;

    if (target.classList.contains('want-faster')) {
        target.checked ? showElem(fastRange) : hideElem(fastRange);
    }

    if (target.classList.contains('calc-handler')) {
        priceCalculation(target);
    }
};

startButton.addEventListener('click', () => {
    showElem(mainForm);
    hideElem(firstScreen);
});

endButton.addEventListener('click', () => {
    for (const elem of formCalculate.elements) {
        if (elem.tagName.toLocaleLowerCase() === 'fieldset') {
            hideElem(elem);
        }
    }

    showElem(total);
});

formCalculate.addEventListener('change', handlerCallBackForm);

priceCalculation(adapt);
