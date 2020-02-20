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
    typeSite = document.querySelector('.type-site'),
    maxDeadline = document.querySelector('.max-deadline'),
    rangeDeadline = document.querySelector('.range-deadline'),
    deadlineValue = document.querySelector('.deadline-value');

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

const renderTextContent = (total, site, maxDay, minDay) => {
    totalPriceSum.textContent = total;
    typeSite.textContent = site;
    maxDeadline.textContent = changeEnding(maxDay, [' дня', ' дней', ' дней']);
    rangeDeadline.min = minDay;
    rangeDeadline.max = maxDay;
    deadlineValue.textContent = changeEnding(rangeDeadline.value, [' днень', ' дня', ' дней']);
};

const priceCalculation = elem => {
    let result = 0,
        index = 0,
        options = [],
        site = '',
        maxDedlineDay = DATA.deadlineDay[index][1],
        mixDedlineDay = DATA.deadlineDay[index][0];

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
        }
    }

    if (elem.classList.contains('calc-handler')) {
        console.dir(elem);
        // elem.nextElementSinling.parentElement.children[2].textContent = elem.checked ? 'Да' : 'Нет';
        elem.nextElementSibling.nextElementSibling.textContent = elem.checked ? 'Да' : 'Нет';
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
    
    renderTextContent(result, site, maxDedlineDay, mixDedlineDay);
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
