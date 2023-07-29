const options = [
    '1',
    '2',
    '3',
    '4',
    '5','6'
];

function setUpSpinner() {
    let currentDegree = 0;
    const degreeIncrement = 360 / options.length;

    const wheel = document.getElementById('wheel');

    options.forEach(option => {
        const element = document.createElement('span');
        element.textContent = option;
        element.style.transform = `rotate(${currentDegree}deg)`;
        element.style.clipPath = `polygon(50% 50%, 100% 50%, 100% 0, 50% 0%)`;;
        element.style.backgroundColor = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
        wheel.appendChild(element);

        currentDegree += degreeIncrement;
    });
}

setUpSpinner();

function spin() {
    const min = 1080; // Spin at least 3 full circles
    const max = 9999; // Spin at most a bunch of degrees

    const randomSpin = Math.floor(Math.random() * (min - max) + max);

    document.getElementById('wheel').style.transform = `rotate(${deg}deg)`;

    const element = document.getElementById('spinner');
    element.classList.remove('animate');
    setTimeout(() => {
        element.classList.add('animate');
    }, 5000); // TODO make this a random timeout?
}