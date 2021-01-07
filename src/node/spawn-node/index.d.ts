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
}

/**
 * The SpawnPlan is the memory structure indicating the plan of the SpawnNode
 */
interface SpawnPlan {

}

interface SpawnNodeMemoryComplement extends MemoryComplement {

}
