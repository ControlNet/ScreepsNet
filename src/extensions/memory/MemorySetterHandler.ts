export class MemorySetterHandlerImpl<T extends ObjectMemory = ObjectMemory> implements MemorySetterHandler<T> {
    private readonly name: string;
    private readonly category: MemoryIndex;

    constructor(name: string, category: MemoryIndex) {
        this.name = name;
        this.category = category;
    }

    as(memory: T): void {
        Memory[this.category][this.name] = memory;
    }

}