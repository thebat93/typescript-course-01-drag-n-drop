// Тип Project
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Стейт
type Listener = (items: Project[]) => void;

class ProjectState {
  // Список подписчиков
  private listeners: Listener[] = [];

  // Стейт: список сохраненных проектов
  private projects: Project[] = [];

  // Поле, хранящее инстанс класса (паттерн синглтон)
  private static instance: ProjectState;

  // Создание инстанса разрешено только с помощью getInstance()
  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectState();
    return this.instance;
  }

  // Метод для добавления подписчика
  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
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

    // Уведомляем подписчиков об изменении стейта
    for (const listenerFn of this.listeners) {
      // Передаем в качестве аргумента копию стейта
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

// Валидация
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;

  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid &&
      validatableInput.value.trim().length >= validatableInput.minLength;
  }

  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid &&
      validatableInput.value.trim().length <= validatableInput.maxLength;
  }

  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  return isValid;
}

// Декоратор autobind
// Возвращает метод, забинденный к контексту инстанса класса
function autobind(_: any, _1: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  return adjustedDescriptor;
}

// Класс ProjectList
class ProjectList {
  // Шаблон формы
  templateElement: HTMLTemplateElement;

  // Рутовый элемент приложения
  hostElement: HTMLDivElement;

  // Секция со списком
  element: HTMLElement;

  // Список проектов, которые требуется отрендерить
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;

    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    this.assignedProjects = [];

    const importedHTML = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedHTML.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    // Добавление подписчика: рендер нового стейта при его изменении
    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    for (const item of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = item.title;
      listEl.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

// Класс ProjectInput
class ProjectInput {
  // Шаблон формы
  templateElement: HTMLTemplateElement;

  // Рутовый элемент приложения
  hostElement: HTMLDivElement;

  // Форма
  element: HTMLFormElement;

  // Поля формы
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;

    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedHTML = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedHTML.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  // Метод для получения и валидации данных формы
  private getUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input, please try again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  // Обработчик сабмита формы
  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();

    const userInput = this.getUserInput();

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;

      projectState.addProject(title, description, people);

      this.clearInputs();
    }
  }

  // Настройка слушателя сабмита формы
  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  // Метод для рендеринга формы в рутовый элемент
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const projInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
