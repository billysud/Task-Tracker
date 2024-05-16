const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
let selectedDate = null;
let tasksByDate = {};

// Load tasks from local storage when the page loads
document.addEventListener("DOMContentLoaded", function () {
    tasksByDate = JSON.parse(localStorage.getItem("tasksByDate")) || {};
    selectedDate = new Date().toISOString().split("T")[0]; // default to today
    renderCalendar(new Date());
    renderTasks(selectedDate);
});

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskInput = document.getElementById("task-input");
    const taskText = taskInput.value.trim();
    const taskDate = document.getElementById("task-date").value || selectedDate; // Use selected date if no date is specified

    if (taskText !== "" && taskDate) {
        createTask(taskText, taskDate);

        // Save tasks to local storage
        saveTaskToLocalStorage(taskText, taskDate);

        taskInput.value = "";
        document.getElementById("task-date").value = "";
    }
});

function createTask(taskText, date) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    taskItem.textContent = taskText;

    // Create trash icon
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa", "fa-trash", "trash-icon");
    taskItem.appendChild(trashIcon);

    taskItem.addEventListener("click", function (event) {
        if (event.target.classList.contains("trash-icon")) {
            // Remove the task item
            this.remove();
            // Remove task from local storage
            removeTaskFromLocalStorage(taskText, date);
        } else {
            this.classList.toggle("completed");
        }
    });

    taskList.appendChild(taskItem);
}

function saveTaskToLocalStorage(taskText, date) {
    if (!tasksByDate[date]) {
        tasksByDate[date] = [];
    }
    tasksByDate[date].push(taskText);
    localStorage.setItem("tasksByDate", JSON.stringify(tasksByDate));
}

function removeTaskFromLocalStorage(taskText, date) {
    if (tasksByDate[date]) {
        tasksByDate[date] = tasksByDate[date].filter(task => task !== taskText.trim());
        localStorage.setItem("tasksByDate", JSON.stringify(tasksByDate));
    }
}

function renderTasks(date) {
    taskList.innerHTML = ""; // Clear current tasks
    if (tasksByDate[date]) {
        tasksByDate[date].forEach(taskText => {
            createTask(taskText, date);
        });
    }
}

const monthYear = document.getElementById("month-year");
const daysContainer = document.getElementById("days");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

let currentDate = new Date();

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

    // Set month and year in the header
    monthYear.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Get first and last day of the month
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDayOfLastMonth = new Date(year, month, 0).getDate();

    // Clear previous days
    daysContainer.innerHTML = '';

    // Add days of previous month
    for (let i = firstDayOfMonth; i > 0; i--) {
        const day = document.createElement("div");
        day.textContent = lastDayOfLastMonth - i + 1;
        day.classList.add("other-month");
        daysContainer.appendChild(day);
    }

    // Add days of current month
    for (let i = 1; i <= lastDateOfMonth; i++) {
        const day = document.createElement("div");
        day.textContent = i;
        const dayDate = new Date(year, month, i).toISOString().split("T")[0];
        day.dataset.date = dayDate;

        if (isCurrentMonth && i === today.getDate()) {
            day.classList.add("current-day");
        }

        day.addEventListener("click", () => {
            selectedDate = dayDate;
            renderTasks(selectedDate);
        });

        daysContainer.appendChild(day);
    }

    // Add days of next month to fill the last row
    const totalDays = firstDayOfMonth + lastDateOfMonth;
    const remainingDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);

    for (let i = 1; i <= remainingDays; i++) {
        const day = document.createElement("div");
        day.textContent = i;
        day.classList.add("other-month");
        daysContainer.appendChild(day);
    }
}

// Event listeners for month navigation
prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

// Initial render
renderCalendar(currentDate);
