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
}

type SpawnNodeType = "SpawnNode";

type SpawnNodeMemoryType = "SpawnNodeMemory";

/**
 * The SpawnPlan is the memory structure indicating the plan of the SpawnNode
 */
interface SpawnPlan {

}

interface SpawnNodeMemoryComplement extends MemoryComplement {
    plan: Array<SpawnPlan>
}
