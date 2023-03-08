import './index.css';
import { todoPresentor } from "./todos/todoPresentor";
import { Publisher } from "./todos/publisher";
import { TodoView } from './todos/todoView';
import { TodoModel } from "./todos/todoModel";

const todosPublisher = new Publisher();
const todoModel = new TodoModel();
const todoView = new TodoView();

todoPresentor(todosPublisher, todoModel, todoView, document.querySelector('.add-todo-form'));

todosPublisher.emit('load');