import { NodeBase, TopNodeBase } from "node/Node";


export class SpawnNodeImpl extends TopNodeBase implements SpawnNode {
    protected readonly _structure: StructureSpawn;
    protected readonly _superNode: Node = null;

    protected reconstructSubNodes(): void {
    }

    protected reconstructUnits(): void {
    }

    run(): void {
        // TODO add logic
    }

    private readonly plan: Array<SpawnPlan> = [];

    static readonly build: Builder<SpawnNode> = {
        // TODO
        with(...args): SpawnNode {
            return undefined;
        },

        from(memory: NodeMemory<SpawnNodeMemoryComplement>, cluster: Cluster): SpawnNode {
            return undefined;
        },
    }

    hasFlag(): boolean {
        return true;
    }

    isTopNode(): boolean {
        return false;
    }

    spawn(unit: Unit): void {
        // TODO
    }

    get structure(): StructureSpawn {
        return this._structure;
    }

    protected save(): void {
        // TODO
    }


}
