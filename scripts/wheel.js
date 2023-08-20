/**
 * Functions for setting up and managing the random wheel
 */

const SPINNER = 'spinner';

const winnerRow = document.getElementById('winnerRow')
let timeOut = undefined;

const defaultOptions = [
    {item: 'option 1', color: generateRandomColor()},
    {item: 'option 2', color: generateRandomColor()},
    {item: 'option 3', color: generateRandomColor()},
    {item: 'option 4', color: generateRandomColor()}
];

let options = [];

function determineOptions() {
    if (checkIfQueryParameters()) {
        options = getQueryParameters();
    } else if (checkIfLocallyStored(SPINNER)) {
        options = loadLocalData(SPINNER);
    } else {
        options = defaultOptions;
    }
}

/**
 * Option list
 */
function generateOptionList() {
    options.forEach((option, i) => {
        createOption(option, i);
    });
}

function addNewOption() {
    const newItem = {item: `option ${options.length + 1}`, color: generateRandomColor()};
        options.push(newItem);
        createOption(newItem, options.length-1);
        setUpSpinner();
}

function createOption(option, i) {
    const element = document.createElement('div');
    element.className = 'optionRow';
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = option.item;
    textInput.addEventListener('change', e => {
        options[i].item = e.target.value;
        setUpSpinner();
    });

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = option.color.backgroundColor;
    colorInput.addEventListener('change', e => {
        options[i].color.backgroundColor = e.target.value;
        options[i].color.textColor = determineTextColor(e.target.value);
        setUpSpinner();
    });

    const removeInput = document.createElement('button');
    removeInput.className = 'button';
    removeInput.textContent = 'X';
    removeInput.addEventListener('click', () => {
        options.splice(options.findIndex(e => e === option), 1);
        element.remove();
        setUpSpinner();
    });

    element.appendChild(textInput);
    element.appendChild(colorInput);
    element.appendChild(removeInput);

    const optionBox = document.getElementById('optionsList');
    optionBox.appendChild(element);
}

/**
 * Spinner stuff
 */

// Create the spinner
function setUpSpinner() {
    let currentDegree = 0;
    const degreeIncrement = 360 / options.length;

    const wheel = document.getElementById('wheel');

    wheel.innerHTML = '';

    options.forEach(option => {
        if (options.length > 2) {
            createWedge(wheel, option, currentDegree, degreeIncrement);
        } else if (options.length === 2) {
            drawTwoWedges(wheel, option, currentDegree);
        } else {
            createSingleElementWheel(wheel, option)
        }

        currentDegree += degreeIncrement;
    });
}

function createSingleElementWheel(wheel, option) {
    const element = document.createElement('span');
    element.className = 'wedge'; 
    element.style.display = 'flex';
    element.style.justifyContent = 'center';
    element.style.alignItems = 'center';
    
    const text = document.createElement('span');
    text.textContent = option.item;
    text.className = 'wedgeText';
    element.appendChild(text);

    const colors = option.color;
    element.style.backgroundColor = colors.backgroundColor;
    text.style.color = colors.textColor;
    
    wheel.appendChild(element);
}

// Special function for drawing two "wedges"
function drawTwoWedges(wheel, option, currentDegree) {
    const element = document.createElement('span');
    element.className = 'wedge';
    if (currentDegree === 0) {
        element.style.clipPath = 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)';
    } else {
        element.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)';
    }

    const colors = option.color; 
    element.style.backgroundColor = colors.backgroundColor;

    element.appendChild(_createWedgeText(option, currentDegree, 180, colors.textColor))

    wheel.appendChild(element); 
}

// Function for creating 3+ wedges
function createWedge(wheel, option, currentDegree, degreeIncrement) {
    const element = document.createElement('span');
    element.className = 'wedge'; 
    element.style.clipPath = generateClipPath(50, currentDegree, currentDegree+degreeIncrement);

    // The clipPath for 3 wedges is too small, we need to scale it up for the rounded border of the parent element to work
    if (options.length === 3) {
        element.style.width = '900px';
        element.style.height = '900px';
    }

    const colors = option.color;
    element.style.backgroundColor = colors.backgroundColor;

    wheel.appendChild(element);

    element.appendChild(_createWedgeText(option, currentDegree, degreeIncrement, colors.textColor));
}

// Add the text to the wedges
function _createWedgeText(option, currentDegree, degreeIncrement, color) {
    const innerElement = document.createElement('span');
    innerElement.className = 'wedgeText';
    innerElement.style.color = color;
    innerElement.textContent = option.item;
    // radians = degrees * (π / 180)
    const textRotation = (currentDegree + (0.5 * degreeIncrement)) * Math.PI / 180;
    innerElement.style.transform = `rotate(${(textRotation)}rad)`;
    const multiplier = window.innerWidth < 450 ? 15 : 20;
    const top = multiplier * Math.sin(textRotation);
    const left = multiplier * Math.cos(textRotation);
    innerElement.style.left = `${50 + left}%`;
    innerElement.style.top = `${50 + top}%`;

    return innerElement;
}

// Clip the div into a wedge shape
function generateClipPath(radius, angleStart, angleEnd) {
    // Convert to radians
    let radStart = (angleStart * Math.PI) / 180;
    let radEnd = (angleEnd * Math.PI) / 180;

    // Calculate start and end points along circle's circumference
    let x1 = radius + radius * Math.cos(radStart);
    let y1 = radius + radius * Math.sin(radStart);
    let x2 = radius + radius * Math.cos(radEnd);
    let y2 = radius + radius * Math.sin(radEnd);

    // Generate and return the clip-path string
    return `polygon(${radius}% ${radius}%, ${x1}% ${y1}%, ${x2}% ${y2}%)`;
}

// Generates random background colors and sets the appropriate font color
function generateRandomColor() {
    const backgroundColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');

    return {
        backgroundColor: backgroundColor,
        textColor: determineTextColor(backgroundColor)
    };
}

// Decide if the text is white or black based on brightness
function determineTextColor(backgroundColor) {
    const r = parseInt(backgroundColor.substr(1, 2), 16);
    const g = parseInt(backgroundColor.substr(3, 2), 16);
    const b = parseInt(backgroundColor.substr(5, 2), 16);

    const brightness = (r * 0.299 + g * 0.587 + b * 0.114);

    return brightness > 130 ? '#000000' : '#FFFFFF';
}

// Spin the wheel
function spin() {
    winnerRow.style.visibility = 'hidden';

    const min = 1080; // Spin at least 3 full circles
    const max = 10080; // Spin at most 30 times

    const randomSpin = Math.floor(Math.random() * (max - min) + min);

    document.getElementById('wheel').style.transform = `rotate(${randomSpin}deg)`;

    const element = document.getElementById('spinner');
    element.classList.remove('animate');
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
        element.classList.add('animate');

        document.getElementById('spinButton').innerText = 'Spin Again';

        const winner = calculateWinner(randomSpin);
        winnerRow.style.visibility = 'visible';
        winnerRow.style.color = winner.color.backgroundColor;
        winnerRow.innerText = `The winner is ${winner.item}!`;
    }, 5000);
}

// Announce the winner
function calculateWinner(randomSpin) {
    const degreeFromZero = 360 - (randomSpin % 360);
    const degreeIncrement = 360 / options.length;
    for (let i = 0; i * degreeIncrement <= 360; i++) {
        const currentDegree = i * degreeIncrement;
        if (degreeFromZero >= currentDegree && degreeFromZero < currentDegree + degreeIncrement) {
            return options[i];
        }
    }
}

/**
 * Save and share
 */

// Save to local storage
function saveData () {
    storeLocalData(SPINNER, options);
    alert('Options should be saved and can be used next time you visit this page!');

}

// Save query parameters in URL
async function shareData () {
    const newUrl = generateURLWithQueryParameters(options);
    await navigator.clipboard.writeText(newUrl);
    alert('Shareable URL copied to clipboard!');

    window.location.href = newUrl;
}

/**
 * Init the spinner
 */
determineOptions();
setUpSpinner();
generateOptionList();