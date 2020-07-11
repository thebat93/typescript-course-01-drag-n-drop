// Базовый класс Component

export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    // Шаблон формы
    templateElement: HTMLTemplateElement;

    // Рутовый элемент приложения
    hostElement: T;

    // Элемент для рендеринга
    element: U;

    constructor(
        templateId: string,
        hostElementId: string,
        insertAtStart: boolean,
        newElementId?: string
    ) {
        this.templateElement = document.getElementById(
            templateId
        )! as HTMLTemplateElement;

        this.hostElement = document.getElementById(hostElementId)! as T;

        const importedHTML = document.importNode(
            this.templateElement.content,
            true
        );

        this.element = importedHTML.firstElementChild as U;

        if (newElementId) {
            this.element.id = newElementId;
        }

        this.attach(insertAtStart);
    }

    private attach(insertAtStart: boolean) {
        this.hostElement.insertAdjacentElement(
            insertAtStart === true ? "afterbegin" : "beforeend",
            this.element
        );
    }

    abstract configure(): void;
    abstract renderContent(): void;
}
