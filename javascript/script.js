const formAdd = document.getElementById("todo_form");
const inputAdd = document.getElementById("todo_input");
const btnAdd = document.getElementById("todo_button");

const editForm = document.getElementById("edit_form");
const editInput = document.getElementById("edit_input");
const editBtn = document.getElementById("edit_button");
const editCancel = document.getElementById("cancel_edit_btn");

const toolbar = document.getElementById("toolbar");
const pesquisar = document.getElementById("search");
const pesquisarInput = document.getElementById("search_input");
const pesquisarBtn = document.getElementById("erase_button");

const filtro = document.getElementById("filter");
const selecao = document.getElementById("filter_select");
const lista = document.getElementById("todo_list");

let oldTitle;

//? adionar tarefa

const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoText = document.createElement("h3");
  todoText.innerText = text;
  todo.appendChild(todoText);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("complete_button", "todo-btn");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit_button", "todo-btn");
  editBtn.innerHTML = '<i class="fa-solid fa-edit"></i>';
  todo.appendChild(editBtn);

  const deletBtn = document.createElement("button");
  deletBtn.classList.add("delete_button", "todo-btn");
  deletBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  todo.appendChild(deletBtn);

  //usando o localstorage

  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ text, done });
  }

  lista.appendChild(todo);

  inputAdd.value = "";
  inputAdd.focus();
};

//? editar tarefa
const toggleEditForm = () => {
  editForm.classList.toggle("hide");
  formAdd.classList.toggle("hide");
  lista.classList.toggle("hide");
};

formAdd.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = inputAdd.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

const updateTodo = (newTitle) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");
    if (todoTitle.innerText === oldTitle) {
      todoTitle.innerText = newTitle;
      upadteTodosLocalStorage(oldTitle, newTitle);
    }
  });
};

//?pesquisar tarefa
const getSearchTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase();
    const normslizeSearch = search.toLowerCase();

    if (!todoTitle.includes(normslizeSearch)) {
      todo.style.display = "none";
    } else {
      todo.style.display = "flex";
    }
  });
};

//? filtro

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => {
        todo.style.display = "flex";
      });
      break;
    case "completed":
      todos.forEach((todo) => {
        if (todo.classList.contains("done")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
      });
      break;
    case "uncompleted":
      todos.forEach((todo) => {
        if (!todo.classList.contains("done")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
      });
      break;
    default:
      break;
  }
};

//? evento no documento todo
document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div"); // pega o elemento pai mais proximo
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText;
  }

  if (targetEl.classList.contains("complete_button")) {
    parentEl.classList.toggle("done");
    updateTodostatusLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("delete_button")) {
    parentEl.remove(); //? remove o elemento
    removeTodoLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("edit_button")) {
    toggleEditForm();

    editInput.value = todoTitle;
    oldTitle = todoTitle;
  }
});

editCancel.addEventListener("click", (e) => {
  e.preventDefault();

  toggleEditForm();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newTitle = editInput.value;

  if (newTitle) {
    updateTodo(newTitle);
  }

  toggleEditForm();
});

//! busca

pesquisarInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchTodos(search);
});

pesquisarBtn.addEventListener("click", (e) => {
  e.preventDefault();
  pesquisarInput.value = "";

  pesquisarInput.dispatchEvent(new Event("keyup")); //dispara um evento
});

//! filtro

selecao.addEventListener("change", (e) => {
  const filterValue = e.target.value; //elemento que foi clicado

  filterTodos(filterValue);
});

//! localstorage

const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || []; //? pega o item do localstorage e transforma em um array ou retorna um array vazio
  return todos;
};

const loadTodosLocalStorage = () => {
  const todos = getTodosLocalStorage();
  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoTitle) => {
  const todos = getTodosLocalStorage();
  const newTodos = todos.filter((todo) => todo.text !== todoTitle);
  localStorage.setItem("todos", JSON.stringify(newTodos));
};

const updateTodostatusLocalStorage = (todoTitle) => {
    const todos = getTodosLocalStorage();
    todos.map((todo) => {
        if (todo.text === todoTitle) {
        todo.done = !todo.done;
        }
        return todo;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

const upadteTodosLocalStorage = (oldTitle, newTitle) => {
    const todos = getTodosLocalStorage();
    todos.map((todo) => {
        if (todo.text === oldTitle) {
            todo.text = newTitle;
        }
        return todo;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

loadTodosLocalStorage();


