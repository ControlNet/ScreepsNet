/**
 * The base types in the ScreepsNet.
 */
interface NetObject {
    /**
     * Object name.
     */
    readonly name: string;

    /**
     * Type
     */
    readonly type: NetObjectType;

    /**
     * Run in main loop.
     */
    run(...args: any[]): void;
}


/**
 * The string type for all NetObject.
 */
type NetObjectType = ClusterType | NodeType | UnitType;

/**
 * The memory type of NetObject
 */
interface NetObjectMemory {
    name: string;
    type: string;
    memoryType: MemoryType;
}

/**
 * The string type of memory.
 */
type MemoryType = ClusterMemoryType | NodeMemoryType | UnitMemoryType;

/**
 * The memory type for both primitive Screeps memory and ScreepsNet memory.
 */
type ObjectMemory = NetObjectMemory | CreepMemory | PowerCreepMemory | FlagMemory | RoomMemory | SpawnMemory;

/**
 * The builder can build a new object or reconstruct from memory.
 * @interface
 * @typeParam T - The target object type.
 */
interface Builder<T extends NetObject> {
    /**
     * Build for new objects
     * @param args - The arguments for constructor
     * @returns The object.
     */
    with(...args: any[]): T;

    /**
     * Reconstruct from memory
     * @param memory - The specified memory object for that object.
     * @param args - Other args used for reconstruction.
     * @returns The object.
     */
    from(memory: NetObjectMemory, ...args: any[]): T;
}

interface Coordinate {
    x: number;
    y: number;
}
