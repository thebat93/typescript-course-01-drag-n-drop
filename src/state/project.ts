// Стейт

import { Project, ProjectStatus } from '../models/project.js';

type Listener<T> = (items: T[]) => void;

// Базовый класс State
class State<T> {
    // Список подписчиков
    protected listeners: Listener<T>[] = [];

    // Метод для добавления подписчика
    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}

class ProjectState extends State<Project> {
    // Стейт: список сохраненных проектов
    private projects: Project[] = [];

    // Поле, хранящее инстанс класса (паттерн синглтон)
    private static instance: ProjectState;

    // Создание инстанса разрешено только с помощью getInstance()
    private constructor() {
        super();
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }

        this.instance = new ProjectState();
        return this.instance;
    }

    // Метод для добавления проекта в стейт
    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        );

        this.projects.push(newProject);
        this.updateListeners();
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find(project => project.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }

    private updateListeners() {
        // Уведомляем подписчиков об изменении стейта
        for (const listenerFn of this.listeners) {
            // Передаем в качестве аргумента копию стейта
            listenerFn(this.projects.slice());
        }
    }
}

export const projectState = ProjectState.getInstance();
