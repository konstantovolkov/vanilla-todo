// шаблон тудушки
const renderTodo = (todo) => {
    const todoElementTemplate = document.createElement('template')

    todoElementTemplate.innerHTML = `
            <li class="todo" data-todo-id=${todo.id} >
                <label for="${todo.id}">
                    <input type="checkbox" data-todo-action="toggle" id="${todo.id}" ${todo.completed ? 'checked' : ''}>
                    <p>${todo.todo}</p>
                </label>
                <div class="delete-icon" data-todo-action="delete"/>
            </li>
        `

    return todoElementTemplate.content
};

export class TodoView {
    constructor() {
        // сохраняем элементы-контейнеры со списко тудушек
        this.activeTodosContainerElement = document.querySelector('[data-todos="active"]');
        this.completedTodosContainerElement = document.querySelector('[data-todos="completed"]');
    }

    appendTodo(todo) {
        this.activeTodosContainerElement.append(renderTodo(todo));

    }

    renderTodoList(activeTodos, completedTodos) {
        this.activeTodosContainerElement.append(...activeTodos.map(renderTodo));
        this.completedTodosContainerElement .append(...completedTodos.map(renderTodo))
    }

    // удаляем тудушку из одной колонки и вставляем в другую
    moveTodo(todo) {
        const todoElement = document.querySelector(`[data-todo-id="${todo.id}"]`)

        if (todoElement.closest('[data-todos="active"]')) {
            this.removeTodo(todo)
            this.completedTodosContainerElement.append(renderTodo(todo))
        } else {
            this.removeTodo(todo)
            this.activeTodosContainerElement.append(renderTodo(todo))
        }

    }

    removeTodo({ id }) {
        document.querySelector(`[data-todo-id="${id}"]`).remove();
    }
}