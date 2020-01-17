// Conversor monetario. Realiza una página que muestre un formulario para la conversión de Euros a Pesetas o viceversa. Los campos del formulario han de poder ser limpiados.
/**
 * Algoritmo
 * - Capturo el valor input
 * - Hago la Conversion
 * - Inserto el valor en la pantalla
 * 
 * Funciones
 * - Captura valor
 */

// Variables    --------------------------------------------------------------------------------------
const screen = document.getElementById('screen'),
    input = document.getElementById('input'),
    currencyIn = document.getElementById('currency-in'),
    currencyOut = document.getElementById('currency-out'),
    change = document.getElementById('change'),
    submit = document.getElementById('submit'),
    update = document.getElementById('update');

let USD, BOLIVAR, PESO, EURO;

let optionAnterior, optionModificado, aux, selectedIn=0, selectedOut=1;
let inputValor;
    optionsTemplate = document.getElementById('options-template');
    optionsOriginal = [...optionsTemplate.content.cloneNode(true).children];
    console.log(input.value);

// Event Listeners
eventListeners();

function eventListeners() {
    addEventListener('DOMContentLoaded', llenadoInicial);
    addEventListener('DOMContentLoaded', cargaAPI);
    // currencyIn.addEventListener('change', cambiaOption);
    // currencyOut.addEventListener('change', cambiaOption);

    change.addEventListener('click', intercambiaOption);
    input.addEventListener('keyup', validar);
    input.addEventListener('blur', obtieneValor);
    submit.addEventListener('click', conversion);
    // input.addEventListener('keypress', compruebaNumeros)
}


// Funciones    -----------------------------------------------------------------------------------------
function cargaAPI() {
    fetch("https://s3.amazonaws.com/dolartoday/data.json")
        .then(res => res.json())
        .then(data => {
            console.log(data.USD.dolartoday);
            USD = data.USD.dolartoday
            BOLIVAR = 1 / USD;
            PESO = data.COL.efectivo;
        })
}

function llenadoInicial(e) {
    const fragment = document.createDocumentFragment()
    optionsOriginal.forEach(i => fragment.appendChild(i) );

    currencyIn.appendChild(fragment.cloneNode(true))
    currencyOut.appendChild(fragment.cloneNode(true))

    currencyOut.options[currencyOut.selectedIndex+1].setAttribute('selected', "selected");
    
}

function intercambiaOption(e) {
    e.preventDefault();
    /**
     * El problema fue que por alguna razon el "select" no se actualiza al agregarle el atributo "selected".
     * Por ello se tuvo que inyectar de nuevo ambas listas al haber un cambio
     */
    const fragment = document.createDocumentFragment()
    optionsOriginal.forEach(i => fragment.appendChild(i));
    let aux, indexIn, indexOut;

    indexIn = currencyIn.selectedIndex;
    indexOut = currencyOut.selectedIndex;

    aux = optionModificado;
    optionModificado = optionAnterior;
    optionAnterior = aux;
        

    optionsOriginal.forEach(() => {
        currencyOut.removeChild(currencyOut.firstChild) 
        currencyIn.removeChild(currencyIn.firstChild) 
    });
    currencyOut.appendChild(fragment.cloneNode(true));
    currencyIn.appendChild(fragment.cloneNode(true));

    currencyIn.options[indexIn].removeAttribute("selected");
    currencyIn.options[indexOut].setAttribute('selected', "selected");
    
    currencyOut.options[indexOut].removeAttribute("selected");
    currencyOut.options[indexIn].setAttribute('selected', "selected");
    
}

function modificaOption(e, band) {
    e.preventDefault()
    const fragment = document.createDocumentFragment()
    optionsOriginal.forEach(i => fragment.appendChild(i) );
    
    if (band) {
        aux = optionModificado;
        console.log("aux-> " + aux);
        optionModificado = optionAnterior;
        console.log("optionModificado-> " + optionModificado);
        console.log("selectedIn->"+ selectedIn);
        console.log("selectedOut->"+ selectedOut);
        optionsOriginal.forEach(() => {
            currencyOut.removeChild(currencyOut.firstChild) 
        });
        currencyOut.appendChild(fragment.cloneNode(true));

        selectedIn = currencyIn.selectedIndex;

        if (selectedOut === optionAnterior) currencyOut.options[aux].setAttribute('selected', "selected");
        else currencyOut.options[optionAnterior].setAttribute('selected', "selected");
    
        optionAnterior = aux;
    } else {
        aux = optionModificado;
        console.log("aux<- " + aux);
        optionModificado = optionAnterior;
        console.log("optionModificado<- " + optionModificado);
        console.log("selectedIn<-"+ selectedIn);
        console.log("selectedOut<-"+ selectedOut);
        optionsOriginal.forEach(() => {
            currencyIn.removeChild(currencyIn.firstChild) 
        });
        currencyIn.appendChild(fragment.cloneNode(true))

        selectedOut = currencyOut.selectedIndex;
    
        if (selectedIn === optionAnterior) currencyIn.options[aux].setAttribute('selected', "selected");
        else currencyIn.options[optionAnterior].setAttribute('selected', "selected");
        
        optionAnterior = aux;
    }
   
}

function cambiaOption(e) {  
    e.preventDefault()
    // console.log(e.target.id);
    let band;

    if (currencyIn.value === currencyOut.value){

        if (e.target.id === 'currency-in'){
            if (optionModificado === undefined || optionAnterior === undefined) {
                optionAnterior = 0;
                optionModificado = 1;
                currencyOut.options[1].removeAttribute("selected");
            }else {
                currencyOut.options[optionModificado].removeAttribute("selected");
            }
            band = true;
        } else if (e.target.id === 'currency-out') {
            if (optionModificado === undefined || optionAnterior == undefined) {
                optionAnterior = 1;
                optionModificado = 0;
            }else {
                currencyIn.options[optionModificado].removeAttribute("selected");

            }
            band = false;
        }
        modificaOption(e, band);
        
    } 
    else {  
        if (e.target.id === 'currency-in') {
            optionAnterior = currencyIn.selectedIndex;
        }else if (e.target.id === 'currency-out') {
            optionAnterior = currencyOut.selectedIndex;
        }
    } 
    
}

function validar(e) {
    let valor = e.target.value;
    console.log(e.target.value);

    if (valor.match(/^\d+$/gi)) {
        console.log(valor.match(/^\d$/gi));
        console.log("entra");
        input.classList.remove('fields__input--invalid');
        input.classList.add('fields__input--valid');
    } else {
        input.classList.remove('fields__input--valid');
        input.classList.add('fields__input--invalid');
    }

}

function obtieneValor(e) {
    e.preventDefault();
    console.log(e.target.value);
    inputValor = e.target.value;
    input.classList.remove('fields__input--invalid');
    input.classList.remove('fields__input--valid');
}

function conversion(e) {
    e.preventDefault();
    let op;
    
    if (currencyIn.value === 'dolares' && currencyOut.value === 'bolivares') {
        screen.textContent = input.value * USD;

    } else if (currencyIn.value === 'bolivares' && currencyOut.value === 'dolares') {
        screen.textContent = input.value * BOLIVAR;

    } else if (currencyIn.value === 'bolivares' && currencyOut.value === 'pesos') {
        screen.textContent = input.value * (PESO);

    } else if (currencyIn.value === 'pesos' && currencyOut.value === 'bolivares') {
        screen.textContent = input.value * (PESO * USD);

    } else if (currencyIn.value === 'pesos' && currencyOut.value === 'dolares') {
        screen.textContent = input.value * ((USD / (USD * PESO)) / USD);
    } else if (currencyIn.value === 'dolares' && currencyOut.value === 'pesos') {
        screen.textContent = input.value * (PESO * USD);
    }
    if (screen.textContent.length > 9) {
        screen.style.fontSize = '2em';
    }
}