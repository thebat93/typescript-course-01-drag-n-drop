// Декоратор autobind
// Возвращает метод, забинденный к контексту инстанса класса
export function autobind(_: any, _1: string, descriptor: PropertyDescriptor) {
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
