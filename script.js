const persons = ["Max", "Nan", "Rory", "Jo", "Jaden", "Cas", "Jared"];
const tasks = ["Upstairs Bathroom", "Downstairs Bathroom", "Kitchen", "Living Room", "Hall", "Landing", "Break Week"];
const specialTasks = {
    "Upstairs Bathroom": ["Max", "Nan", "Rory"],
    "Downstairs Bathroom": ["Cas", "Jo", "Jared", "Jaden"]
};

let currentMonday = getMonday(new Date());

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(d.setDate(diff));
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
}

// Seeded random function to ensure consistency across different users
function seededRandom(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function shuffleArray(array, seed) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(seed + i) * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateRotaForCurrentWeek(startDate) {
    let weekNumber = getWeekNumber(startDate);
    let weekOffset = weekNumber % tasks.length;
    const shuffledTasks = [...tasks];
    shuffleArray(shuffledTasks, weekNumber); // Shuffle with the week number as the seed
    const assignedTasks = new Set();
    const rota = [];

    for (const person of persons) {
        let taskIndex = weekOffset;
        let taskAssigned = false;

        while (!taskAssigned) {
            const task = shuffledTasks[taskIndex];
            if ((!specialTasks[task] || specialTasks[task].includes(person)) && !assignedTasks.has(task)) {
                rota.push({ person, task });
                assignedTasks.add(task);
                taskAssigned = true;
            } else {
                taskIndex = (taskIndex + 1) % shuffledTasks.length;
            }
        }

        weekOffset = (weekOffset + 1) % shuffledTasks.length;
    }

    return { rota, startDate };
}

function displayRota(rota, startDate) {
    document.getElementById("start-date").textContent = `Week Starting: ${startDate.toLocaleDateString()}`;
    const tbody = document.getElementById("cleaning-rota").querySelector("tbody");
    tbody.innerHTML = "";

    for (const { person, task } of rota) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${person}</td><td>${task}</td>`;
        tbody.appendChild(row);
    }
}

document.getElementById("next-week-btn").addEventListener("click", function() {
    currentMonday.setDate(currentMonday.getDate() + 7);
    updateRota();
});

function updateRota() {
    currentMonday = getMonday(new Date()); // Always calculate the current week's Monday
    const { rota, startDate } = generateRotaForCurrentWeek(currentMonday);
    displayRota(rota, startDate);
    document.getElementById("next-week-btn").textContent = `Week Starting: ${startDate.toLocaleDateString()}`;
}

updateRota();
