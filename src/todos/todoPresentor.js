// в паттерне MVP презентор перехватывает экшены и для каждого экшена обновляет модель данных и представление
export function todoPresentor(publisher, todoList, renderer, formElement) {
    // c помощью паблишера задаем связку между экшеном и тем, что надо делать, когда этот экше происходит
    publisher.subscribe('load', async () => {
        const todosRaw = await fetch('https://dummyjson.com/todos?limit=10');
        const { todos } = await todosRaw.json();

        todoList.add(...todos); // обновляем модель
        renderer.renderTodoList(todoList.active, todoList.completed); // обновляем представление
    })

    publisher.subscribe('delete', async ({ id }) => {
        const deletedTodoResponse = await fetch(`https://dummyjson.com/todos/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })

        const deletedTodo = await deletedTodoResponse.json();

        // deletedTodoResponse.ok - флаг, который равен true, если статус HTTP-ответа 20X
        if (deletedTodo.isDeleted && deletedTodoResponse.ok) {
            todoList.delete({ id }); // обновляем модель
            renderer.removeTodo({ id }); // обновляем представление
        }
    });

    publisher.subscribe('toggle', async (todo) => {
        const updatedTodoResponse = await fetch(`https://dummyjson.com/todos/${todo.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                completed: !todo.completed,
            })
        });

        const updatedTodo = await updatedTodoResponse.json();

        if (updatedTodo && updatedTodoResponse.ok) {
            todoList.toggle(todo.id);
            renderer.moveTodo(updatedTodo)
        }
    });

    publisher.subscribe('add', async (todo) => {
        const newTodoResponse = await fetch('https://dummyjson.com/todos/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo)
        })

        const newTodo = await newTodoResponse.json();

        if (newTodo && newTodoResponse.ok) {
            todoList.add(newTodo)
            renderer.appendTodo(newTodo)
        }
    });

    document.addEventListener('click', (event) => {
        const todoAction = event.target.dataset.todoAction;

        if (!todoAction) return;

        // отловим клик на чекбокс или кнопку удаления с помощью делегирования
        // т.к. эти кнопки повторяются в каждой тудушке
        const todoId = Number.parseInt(event.target.closest("[data-todo-id]").dataset.todoId);
        const todo = todoList.getById(todoId);

        publisher.emit(todoAction, todo);
    })

    formElement?.addEventListener('submit', async (event) => {
        event.preventDefault(); // дефолтное поведение формы - перезагрузить страницу. нам это не нужно

        const formData = new FormData(formElement);

        const postTodo = {
            ...Object.fromEntries(formData),
            userId: 1, // аутентификация не реализована, поэтому просто айди хардкодом
        }

        formElement.reset(); // сбрсосим значения всех полей формы

        publisher.emit('add', postTodo);
    })
}