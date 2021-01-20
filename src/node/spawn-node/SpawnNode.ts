import { TopNodeBase } from "node/Node";
import { SpawnNodeType } from "./SpawnNodeType";


export class SpawnNodeImpl extends TopNodeBase implements SpawnNode {
    protected readonly _structure: StructureSpawn;
    protected readonly _superNode = undefined;
    private readonly plan: Array<SpawnPlan> = [];


    constructor(name: string, cluster: Cluster, structure: StructureSpawn, flag: Flag) {
        super(name, cluster, structure, flag);
        this._structure = structure;
        this.plan = [];
    }

    protected reconstructSubNodes(): void {
    }

    protected reconstructUnits(): void {
    }

    run(): void {
        // TODO add logic
    }


    static readonly build: NodeBuilder<SpawnNode> = {
        // TODO
        with(...args): SpawnNode {
            return undefined;
        },

        from(memory: NodeMemory<SpawnNodeMemoryComplement>, cluster: Cluster): SpawnNode {
            return undefined;
        },
    }

    protected save(): void {
        // TODO
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

    isBusy(): boolean {
        return this.structure.spawning !== null;
    }

    queueLength(): number {
        return this.plan.length;
    }

    get structure(): StructureSpawn {
        return this._structure;
    }

    get type(): SpawnNodeType {
        return SpawnNodeType;
    }


}
