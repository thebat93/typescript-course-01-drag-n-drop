class ProjectInput {
  // Шаблон формы
  templateElement: HTMLTemplateElement;

  // Рутовый элемент приложения
  hostElement: HTMLDivElement;

  // Форма
  element: HTMLFormElement;

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

    this.attach();
  }

  // Метод для рендеринга формы в рутовый элемент
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const projInput = new ProjectInput();
