// Improved JavaScript code for webapp rota generation

// Constants for persons, tasks, and special tasks
const persons = ["Max", "Nan", "Rory", "Jo", "Jaden", "Cas", "Jared"];
const tasks = ["Upstairs Bathroom", "Downstairs Bathroom", "Kitchen", "Living Room", "Hall", "Landing", "Break Week"];
const specialTasks = {
    "Upstairs Bathroom": ["Max", "Nan", "Rory"],
    "Downstairs Bathroom": ["Cas", "Jo", "Jared", "Jaden"]
};

// Utility functions for date manipulation and rota generation
function getMonday(d) {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function shuffleArray(array, seed) {
    array.forEach((_, i) => {
        const j = Math.floor(seededRandom(seed + i) * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    });
}

// Rota generation logic
function generateRotaForCurrentWeek(startDate) {
    const weekNumber = getWeekNumber(startDate);
    const weekOffset = weekNumber % tasks.length;
    const shuffledTasks = [...tasks];
    shuffleArray(shuffledTasks, weekNumber);
    const assignedTasks = new Set();
    const rota = [];

    persons.forEach(person => {
        let taskIndex = weekOffset;
        while (true) {
            const task = shuffledTasks[taskIndex];
            if ((!specialTasks[task] || specialTasks[task].includes(person)) && !assignedTasks.has(task)) {
                rota.push({ person, task });
                assignedTasks.add(task);
                break;
            }
            taskIndex = (taskIndex + 1) % shuffledTasks.length;
        }
    });

    return { rota, startDate };
}

// UI update logic
function displayRota(rota, startDate) {
    document.getElementById("start-date").textContent = `Week Starting: ${startDate.toLocaleDateString()}`;
    const tbody = document.getElementById("cleaning-rota").querySelector("tbody");
    tbody.innerHTML = rota.map(({ person, task }) => `<tr><td>${person}</td><td>${task}</td></tr>`).join('');
}

// Event handlers and initialization
document.getElementById("next-week-btn").addEventListener("click", () => {
    currentMonday.setDate(currentMonday.getDate() + 7);
    updateRota();
});

let currentMonday = getMonday(new Date());
function updateRota() {
    const { rota, startDate } = generateRotaForCurrentWeek(currentMonday);
    displayRota(rota, startDate);
}

updateRota();
