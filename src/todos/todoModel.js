export class TodoModel {
    constructor() {
        this.todos = [];
    }

    getById(todoId) {
        return this.todos.find(({ id }) => todoId === id)
    }

    get active() {
        return this.todos.filter(({completed}) => !completed);
    }

    get completed() {
        return this.todos.filter(({completed}) => completed);
    }

    add(...todo) {
        this.todos.push(...todo);
    }

    toggle(todoId) {
        const todo = this.todos.find(({ id }) => todoId === id);

        todo.completed = !todo.completed;
    }

    delete(deletedTodo) {
        this.todos.filter(({ id }) => id !== deletedTodo.id);
    }
}