//varible globall part ---------------------------------------------------------------
const select = document.querySelector('#years');
const cars = document.querySelector('#car');
const form = document.querySelector('#form');
const html = new HTMLUL();
//eventListener part ------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    html.displayYear();
});
document.querySelector('.submit').addEventListener('click', function (e) {
    e.preventDefault();
    const year = select.value;
    const carChoose = cars.value;
    const radio = document.querySelector('input[name="radio"]:checked').value;
    if (year === '' || carChoose === '' || radio === '') {
        html.displayError('please fill the input ...');
    } else {
        const info = new insurance(year, carChoose, radio);
        const price = info.caculatePrice(info);
    }
});
//function part -----------------------------------------------------------------------

//constructor for the insurance class
function insurance(year, carChoose, radio) {
    this.year = year;
    this.carChoose = carChoose;
    this.radio = radio;
}

//class for the calculate price
insurance.prototype.caculatePrice = function (info) {
    let priceOriginal = 200000;

    const price = carModel(info);
    const yearProducteCar = yearProduct(info);
    const optionPrice = CarOption(info);
    const finalPrice = priceOriginal * price * yearProducteCar * optionPrice;

    //create <div> because we want to show price and other things on that factor
    const divTotalPrice = document.createElement('div');
    divTotalPrice.innerHTML=
        `
        <div>
            model : ${info.carChoose}
        </div>
        <div>
            product year : ${info.year}
        </div>
        <div>
            option type : ${info.option}
        </div>
        <div>
            total price : ${finalPrice}
        </div>
        `
    ;
    //adding price to the factor part
    const factor = document.querySelector("#factor");
    factor.appendChild(divTotalPrice);
}
//coefficient car option price
function CarOption(info) {
    let priceOption;
    // the trim is when you get the inner text , you have an space in the end of and it cut that space 
    //the radio get value of the inputs that names are radio and checked 
    const radio = document.querySelector('input[name="radio"]:checked').parentElement.innerText.trimEnd();

    //an object for the type of car (enum in java)
    const type = {
        normal: "normal",
        fullOption: "full option"
    }


    switch (radio) {
        case type.fullOption:
            priceOption = 1.5;
            break;
        case type.normal:
            priceOption = 1;
            break;
    }
    return priceOption;
}

//it calculate of coefficient of price .if car was't new it will be cheaper than others
function yearProduct(info) {
    const year = info.year;
    //convert arabic number with english
    let persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
        arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
        fixNumbers = function (str) {
            if (typeof str === 'string') {
                for (var i = 0; i < 10; i++) {
                    str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
                }
            }
            return str;
        };

    //get date to persian but it return in arabic number and it can not use and should be convert to english number 
    const today = new Date().toLocaleDateString('fa-IR');
    const max = fixNumbers(today.slice(0, 4));

    const yearProduct = max - year;

    //coefficient of product year 
    let increasePrice;
    if (yearProduct > 10) {
        increasePrice = 0.25;
    } else if (yearProduct > 15) {
        increasePrice = 0.5;
    } else {
        increasePrice = 1;
    }
    return increasePrice;
}

//we have an unit price and calculate with coefficient with unit price 
function carModel(info) {
    const car = info.carChoose;
    let price;
    switch (car) {
        case "toyota":
            price = 0.75;
            break;
        case "ford":
            price = 1;
            break;
        case "hyunday":
            price = 0.5;
            break;
    }
    return price;
}

//constructor for the htmlul class
function HTMLUL() { };

//class htmlul ->it show option on select-option part 
HTMLUL.prototype.displayYear = function () {
    let persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
        arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
        fixNumbers = function (str) {
            if (typeof str === 'string') {
                for (var i = 0; i < 10; i++) {
                    str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
                }
            }
            return str;
        };
    const today = new Date().toLocaleDateString('fa-IR');
    const max = fixNumbers(today.slice(0, 4));

    const min = max - 20;

    for (let i = max; i >= min; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.innerText = i;
        select.appendChild(option);
    }
};

//it shows the error message for the client people
HTMLUL.prototype.displayError = function (err) {
    console.log(err);
    const div = document.createElement('div');
    div.classList = 'error';
    div.textContent = err;
    form.insertBefore(div, document.querySelector('#choose'));
    setTimeout(() => {
        document.querySelector('.error').remove();
    }, 3000);
}