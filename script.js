
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const empty = document.querySelector("#empty");

let tasks = JSON.parse(localStorage.getItem("taskflow-tasks") || "[]");
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = "";

  const visibleTasks = tasks.filter(task =>
    currentFilter === "all" ||
    (currentFilter === "pending" && !task.completed) ||
    (currentFilter === "completed" && task.completed)
  );

  visibleTasks.forEach(task => {
    const li = document.createElement("li");

    if (task.completed) {
      li.classList.add("done");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
      "aria-label",
      "Marcar tarefa como concluída"
    );

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.textContent = task.text;

    const remove = document.createElement("button");
    remove.className = "delete";
    remove.textContent = "Excluir";

    remove.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.append(checkbox, text, remove);
    list.appendChild(li);
  });

  document.querySelector("#total").textContent = tasks.length;

  document.querySelector("#pending").textContent =
    tasks.filter(task => !task.completed).length;

  document.querySelector("#completed").textContent =
    tasks.filter(task => task.completed).length;

  empty.hidden = visibleTasks.length > 0;
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });

  saveTasks();
  input.value = "";
  renderTasks();
  input.focus();
});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    document.querySelectorAll(".filter").forEach(item => {
      item.classList.toggle("active", item === button);
    });

    renderTasks();
  });
});

renderTasks();
