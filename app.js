// Helper method for safe binding events listeners to handlers
function addEvent (target, event, cb) {
    var evt = typeof event === 'string' ? event : (target.addEventListener ? event[0] : event[1]);

    if(target.addEventListener){
        target.addEventListener(evt, cb, false);    
    }else if(target.attachEvent){            
        target.attachEvent(['on',evt].join(''), cb);    
    }
}

function triggerEvent (event, target) {
    var evt = null;

    if(document.createEventObject){
        evt = document.createEventObject();
        target.fireEvent(['on',event].join(''), evt);
    }else{
        evt = document.createEvent('HTMLEvents');
        evt.initEvent(event, true, true);
        target.dispatchEvent(evt);
    }
}

// Helper method for getting an element by its ID
function GetElById (idString) {
    return document.getElementById(idString);
}

// Helper method to validate errors on fields and handle error message element
function ValidateField (opts) {
    var nextEl = opts.nextEl;

    if(opts.validationRule){
        if (nextEl === null) {
            var error = document.createElement('P');
            error.className = 'error-field-info';
            error.innerHTML = opts.errorMessage;
            opts.field.parentNode.appendChild(error);
        }
    }else {
        if (nextEl !== null) {
            opts.field.parentNode.removeChild(nextEl);
        }
    }
}

// Helper method to validate if the input is empty
function ShouldNotBeEmpty (event) {
    var field = event.target,
        currVal = field.value;

    ValidateField({
        errorMessage: 'This field can\'t be empty',
        field: field,
        nextEl: field.nextElementSibling,
        validationRule: (currVal === '' || /^\s+$/.test(currVal))
    });
}

// Helper method to validate if the select dropdown has a valid option selected
function ShouldSelectValidOptions (event) {
    var field = event.target,
        currVal = field.options[field.selectedIndex].value;

    ValidateField({
        errorMessage: 'This field has an invalid option selected',
        field: field,
        nextEl: field.nextElementSibling,
        validationRule: (currVal === '' || typeof currVal === 'undefined')
    });
}

// Helper method to trim whitespaces from beginning and end of strings
function TrimWS (string) {
    return string.replace(/^\s+/, '').replace(/\s+$/, '');
}

// First Name field requirement function
function AddSpaceBetweenChars (string) {
    return TrimWS(string).split('').join(' ');
}

// Last Name field requirement function
function ReverseChars (string) {
    return TrimWS(string).split('').reverse().join('');
}

// Favorite Food field requirement function
function CalculateASCIICharsCodes (string) {
    var cleanedUpString = TrimWS(string),
        stringLength = cleanedUpString.length,
        charsArr = [],
        sum = 0;
    
    for (var i = 0; i < stringLength; i++) {
        var code = cleanedUpString.charCodeAt(i);

        charsArr.push(code);

        sum += code;
    };

    if(charsArr.length < 1){
        return '';
    }

    var orderedArr = charsArr.sort(),
        orderedArrLength = orderedArr.length,
        numbersArr = [],
        countsArr = [],
        prev;

    for (var i = 0; i < orderedArrLength; i++) {
        var number = orderedArr[i];
        
        if(number !== prev){
            numbersArr.push(number);
            countsArr.push(1);
        }else{
            countsArr[countsArr.length - 1]++;
        }

        prev = number;
    };

    charsArr = [];

    var numbersArrLength = numbersArr.length;

    for (var i = 0; i < numbersArrLength; i++) {
        var substring = null,
            currNumber = numbersArr[i],
            times = countsArr[i];

        if(times > 1){
            substring = ['(',currNumber,' x ',times,')'].join('');
        }else{
            substring = currNumber;
        }

        charsArr.push(substring);
    };

    charsArr = [charsArr.join(' + '), ' = ', sum];

    return charsArr.join('');
}

// Favorite Number field validation function
function EnsureNumbersOnly (event) {    
    var kc = event.keyCode;

    // backspace, tab, left, up, right, down, delete
    if(kc === 8 || kc === 9 || kc === 37 || kc === 38 || kc === 39 || kc === 40 || kc === 46){
        return true;
    }else if(((kc < 48 || kc > 57) && (kc < 96 || kc > 105))){
        event.preventDefault();
        event.stopImmediatePropagation();
    }
}

// Favorite Number field requirement function
function Find2ndHighestFactor (numberString) {
    var number = parseInt(numberString, 10);

    if(isNaN(number)){
        return '';
    }

    var factorsArr = [];

    for (var i = 1; i < number; i++) {
        if(number % i === 0){
            factorsArr.push(i);
        }
    };

    return factorsArr.pop();
}

// Favorite Day of the Week field requirement function
function FindNextDays (day) {
    var dayToMatch = parseInt(day, 10);

    if(isNaN(dayToMatch)){
        return '';
    }

    var currDate = new Date(),
        datesArr = [];

    for (var i = 6; i > 0; i--) {
        var factor = dayToMatch - currDate.getDay() < 1 ? 7 : 0,
            newCurrDate = new Date(
                currDate.getTime() + (((factor + dayToMatch) - currDate.getDay()) * 86400000)
            );

        datesArr.push(newCurrDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'numeric',
            year: '2-digit'
        }));
        
        currDate = newCurrDate;
    };

    return datesArr.join(', ');
}

// Helper method to convert RGB color codes to Hexadecimal color codes
function ToHexFromRgb (color) {
    return (Math.round(parseFloat(color)) + 0x10000).toString(16).substring(3).toUpperCase();
}

// Favorite Color field requirement function
function ChangeColors (colorCode) {
    var colorSquare = GetElById('color-show-off-square'),
        rgbColors = null,
        hexCodeArr = ['#'];

    colorSquare.style.backgroundColor = colorCode !== '' ? colorCode : 'white';
    colorSquare.style.borderColor = colorCode !== '' ? colorCode : 'black';

    if(colorCode !== ''){
        rgbColors = window.getComputedStyle(colorSquare).backgroundColor;

        rgbColors = rgbColors.replace('rgb(', '').replace(')', '').split(', ');

        for (var i = 0; i < 3; i++) {
            hexCodeArr.push( ToHexFromRgb(rgbColors[i]) );
        };

        return hexCodeArr.join('');
    }else{
        return '';
    }
}

// Form submission validation method
function FormSubmit (event) {
    event.preventDefault();

    var formFields = event.target.elements,
        formFieldsLength = formFields.length,
        valuesObj = {};

    for (var i = 0; i < formFieldsLength; i++) {
        var field = formFields[i];
        if(field.nodeName !== 'BUTTON'){
            valuesObj[field.name] = field.value;
            triggerEvent('blur', field);
        }
    };

    if(event.target.getElementsByClassName('error-field-info').length < 1){
        console.log('Successful Submit! -> ', valuesObj);
    }
}

// Helper method to print every requirement function's returned value
function PrintOutput (target, outputValue) {
    var output = GetElById([target,'-output'].join(''));

    output.innerHTML = outputValue !== '' ? outputValue : '---';
}

// Helper method to map and process every field with its respective requirement function
function ProcessOutput (event) {
    var idString = event.target.id.split('-')[0],
        fieldValue = event.target.value,
        processedValue = null;
    
    switch(idString){
        case 'firstName':
            processedValue = AddSpaceBetweenChars( fieldValue );
        break;
        case 'lastName':
            processedValue = ReverseChars( fieldValue );
        break;
        case 'food':
            processedValue = CalculateASCIICharsCodes( fieldValue );
        break;
        case 'number':
            processedValue = Find2ndHighestFactor( fieldValue );
        break;
        case 'day':
            processedValue = FindNextDays( fieldValue );
        break;
        case 'color':
            processedValue = ChangeColors( fieldValue );
        break;
    }

    PrintOutput(idString, processedValue);
}

// Self invoked function to start the application
(function(){

    // Detecting when the DOM tree has finish its loading in order to start the application
    addEvent(document, ['DOMContentLoaded', 'onreadystatechange'], function(){

        var form = GetElById('test-form'),
            fields = [
                'firstName-field',
                'lastName-field',
                'food-field',
                'number-field'
            ],
            selects = [
                'day-field',
                'color-field'
            ],
            fieldsArrLength = fields.length,
            selectsArrLength = selects.length;

        // Cleaning up the form
        form.reset();

        // Binding all of the input fields' events handlers
        for(var i = 0; i < fieldsArrLength; i++){
            addEvent(GetElById(fields[i]), 'keyup', ProcessOutput);

            addEvent(GetElById(fields[i]), 'keypress', ShouldNotBeEmpty);

            addEvent(GetElById(fields[i]), 'blur', ShouldNotBeEmpty);
        }

        // Binding all of the select fields' events handlers
        for(var i = 0; i < selectsArrLength; i++){
            addEvent(GetElById(selects[i]), 'change', ProcessOutput);

            addEvent(GetElById(selects[i]), 'blur', ShouldSelectValidOptions);

            addEvent(GetElById(selects[i]), 'change', ShouldSelectValidOptions);
        }

        // Binding a validation rule to restrict to only number chars and some other helper keys
        // the typing in the number's field
        addEvent(GetElById('number-field'), 'keydown', EnsureNumbersOnly);

        // Binding the validation rule when the form attempts to submit
        addEvent(form, 'submit', FormSubmit);

    });

})();