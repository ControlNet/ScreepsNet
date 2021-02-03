/**
 * The SpawnNode which control the Spawn structure.
 */
interface SpawnNode extends Node {
    /**
     * Get the spawn-node structure.
     */
    readonly structure: StructureSpawn;

    /**
     * Add the unit to spawn-node plan.
     * @param unit - The unit planned to be spawned.
     */
    spawn(unit: Unit): void;

    readonly type: SpawnNodeType;

    /**
     * Get the status if the spawn structure is busy.
     */
    isBusy(): boolean;

    /**
     * Get the length of queue.
     */
    queueLength(): number;

    /**
     * The source cache structures for spawning.
     */
    readonly cache: Array<CacheStructure>;

    readonly flag: Flag;

    readonly plan: Array<SpawnPlan>;
}

type SpawnNodeType = "SpawnNode";

type SpawnNodeMemoryType = "SpawnNodeMemory";

type CacheStructure = StructureSpawn | StructureExtension;

/**
 * The SpawnPlan is the memory structure indicating the plan of the SpawnNode
 */
interface SpawnPlan {
    nodeName: string,
    body: UnitBody,
    name: string,
    opts?: SpawnOptions
}

interface SpawnNodeMemoryComplement extends MemoryComplement {
    plan: Array<SpawnPlan>
}

interface SpawnNodeMemory extends NodeMemory<SpawnNodeMemoryComplement> {
    flagName: string;

    structureId: Id<StructureSpawn>;
}
