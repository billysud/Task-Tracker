const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

// Load tasks from local storage when the page loads
document.addEventListener("DOMContentLoaded", function() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
        tasks.forEach(function(taskText) {
            createTask(taskText);
        });
    }
});

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskInput = document.getElementById("task-input");
    const taskText = taskInput.value.trim();

    if(taskText !== ""){
        createTask(taskText);

        // Save tasks to local storage
        saveTasksToLocalStorage(taskText);

        taskInput.value = "";
    }
});

function createTask(taskText) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    taskItem.textContent = taskText;

    // Create trash icon
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa", "fa-trash", "trash-icon");
    taskItem.appendChild(trashIcon);

    taskItem.addEventListener("click", function(event){
        if (event.target.classList.contains("trash-icon")) {
            // Remove the task item
            this.remove();
            // Remove task from local storage
            removeTaskFromLocalStorage(taskText);
        } else {
            this.classList.toggle("completed");
        }
    });

    taskList.appendChild(taskItem);
}

function saveTasksToLocalStorage(taskText) {
    let tasks;
    if(localStorage.getItem("tasks") === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    tasks.push(taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const updatedTasks = tasks.filter(function(task) {
        return task !== taskText.trim();
    });
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}
