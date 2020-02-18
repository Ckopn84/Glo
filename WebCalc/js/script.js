'use strict';
/* Воркшоп по JS. Калькулятор верстки
18.02.2020 - 21.02.2020
Максим Лескин
GloAcademy
*/

const startButton = document.querySelector('.start-button'),
    firstScreen = document.querySelector('.first-screen'),
    mainForm = document.querySelector('.main-form'),
    formCalculate = document.querySelector('.form-calculate'),
    endButton = document.querySelector('.end-button'),
    total = document.querySelector('.total'),
    fastRange = document.querySelector('.fast-range');

const showElem = elem => {
    elem.style.display = 'block';
};

// const hideElem = elem => {
//     elem.style.display = 'none';
// };
function hideElem (elem) {
    elem.style.display = 'none';
}

const handlerCallBackForm = event => {
    const target = event.target;

    if (target.classList.contains('want-faster')) {
        target.checked ? showElem(fastRange) : hideElem(fastRange);
    }
};

startButton.addEventListener('click', () => {
    showElem(mainForm);
    hideElem(firstScreen);
});

endButton.addEventListener('click', () => {
    // console.log(formCalculate.elements);
    for (const elem of formCalculate.elements) {
        if (elem.tagName.toLocaleLowerCase() === 'fieldset') {
            hideElem(elem);
        }
    }

    showElem(total);
});

formCalculate.addEventListener('change', handlerCallBackForm);