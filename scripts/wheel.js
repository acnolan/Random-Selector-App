// Need to handle special conditions if less than 6 options
// Ideally would like it to work with 4+, two special cases is more manageable
const options = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6'
];

function setUpSpinner() {
    let currentDegree = 0;
    const degreeIncrement = 360 / options.length;

    const wheel = document.getElementById('wheel');

    options.forEach(option => {
        const element = document.createElement('span');
        element.className = 'wedge'; 
        element.style.clipPath = generateClipPath(50, currentDegree, currentDegree+degreeIncrement);
        element.style.backgroundColor = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
        wheel.appendChild(element);


        element.appendChild(_createWedgeText(option, currentDegree, degreeIncrement));

        currentDegree += degreeIncrement;
    });
}

function _createWedgeText(option, currentDegree, degreeIncrement) {
    const innerElement = document.createElement('span');
    innerElement.className = 'wedgeText';
    innerElement.textContent = option;
    // radians = degrees * (π / 180)
    const textRotation = (currentDegree + (0.5 * degreeIncrement)) * Math.PI / 180;
    innerElement.style.transform = `rotate(${(textRotation)}rad)`;
    const top = 20 * Math.sin(textRotation);
    const left = 20 * Math.cos(textRotation);
    innerElement.style.left = `${50 + left}%`;
    innerElement.style.top = `${50 + top}%`;

    return innerElement;
}

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

function spin() {
    const min = 1080; // Spin at least 3 full circles
    const max = 10080; // Spin at most 30 times

    const randomSpin = Math.floor(Math.random() * (max - min) + min);

    document.getElementById('wheel').style.transform = `rotate(${randomSpin}deg)`;

    const element = document.getElementById('spinner');
    element.classList.remove('animate');
    setTimeout(() => {
        element.classList.add('animate');
        alert(`The winner is ${calculateWinner(randomSpin)}!`)
    }, 5000);
}

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

// Init the spinner
setUpSpinner();