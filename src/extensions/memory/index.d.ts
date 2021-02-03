/**
 * The memory of Screeps.
 */
interface Memory {
    /**
     * Memory.clusters stores all information for all clusters.
     */
    clusters: { [name: string]: ClusterMemory };
    /**
     * Memory.nodes stores all information for all nodes.
     */
    nodes: { [name: string]: NodeMemory };
    /**
     * Memory.units stores all information for all nodes.
     */
    units: { [name: string]: UnitMemory };
}

interface MemoryIO {

    /**
     * MemoryGetter can access to the Memory.
     */
    get: MemoryGetter;

    /**
     * MemorySetter can set a memory sub-object with given name as key.
     */
    set: MemorySetter;
}

/**
 * MemoryGetter can access the memory sub objects with given name.
 */
interface MemoryGetter {
    /**
     * Get CreepMemory with creep name.
     * @param name - name of Creep object
     * @returns The CreepMemory of given creep name.
     */
    creep(name: string): CreepMemory;

    /**
     * Get PowerCreepMemory with power creep name.
     * @param name - name of PowerCreep object
     * @returns The PowerCreepMemory of given power creep name.
     */
    powerCreep(name: string): PowerCreepMemory;

    /**
     * Get FlagMemory with flag name.
     * @param name - name of Flag object
     * @returns The FlagMemory of given flag name.
     */
    flag(name: string): FlagMemory;

    /**
     * Get RoomMemory with room name.
     * @param name - name of Room object
     * @returns The RoomMemory of given room name.
     */
    room(name: string): RoomMemory;

    /**
     * Get SpawnMemory with spawn name.
     * @param name - name of Spawn object
     * @returns The SpawnMemory of given spawn name.
     */
    spawn(name: string): SpawnMemory;

    /**
     * Get ClusterMemory with cluster name.
     * @param name - name of Cluster object
     * @typeParam T - The target unit MemoryComplement type.
     * @returns The ClusterMemory of given cluster name.
     */
    cluster<T extends MemoryComplement>(name: string): ClusterMemory<T>;

    /**
     * Get NodeMemory with node name.
     * @param name - name of Node object
     * @typeParam T - The target unit MemoryComplement type.
     * @returns The NodeMemory of given node name.
     */
    node<T extends MemoryComplement>(name: string): NodeMemory<T>;

    /**
     * Get UnitMemory with cluster name.
     * @param name - name of Cluster object
     * @typeParam T - The target unit MemoryComplement type.
     * @returns The ClusterMemory of given cluster name.
     */
    unit<T extends MemoryComplement>(name: string): UnitMemory<T>;

    /**
     * The MemoryAllGetter can access to the all Memory objects in given category.
     */
    all: MemoryAllGetter;
}

/**
 * The MemoryAllGetter can access to the all Memory objects in given category.
 */
interface MemoryAllGetter {
    /**
     * Get all CreepMemory.
     */
    creeps: Array<CreepMemory>;
    /**
     * Get all PowerCreepMemory.
     */
    powerCreeps: Array<PowerCreepMemory>;
    /**
     * Get all FlagMemory.
     */
    flags: Array<FlagMemory>;
    /**
     * Get all RoomMemory.
     */
    rooms: Array<RoomMemory>;
    /**
     * Get all SpawnMemory.
     */
    spawns: Array<SpawnMemory>;
    /**
     * Get all ClusterMemory.
     */
    clusters: Array<ClusterMemory>;
    /**
     * Get all NodeMemory.
     */
    nodes: Array<NodeMemory>;
    /**
     * Get all UnitMemory.
     */
    units: Array<UnitMemory>;
}

/**
 * The MemoryAllGetter can set value in the Memory by provided key/name.
 */
interface MemorySetter {
    /**
     * Set CreepMemory with creep name.
     * @param name - name of Creep object
     * @returns The MemorySetterHandler with registered Creep name.
     */
    creep<T extends CreepMemory = CreepMemory>(name: string): MemorySetterHandler<T>;

    /**
     * Set PowerCreepMemory with power creep name.
     * @param name - name of PowerCreep object
     * @returns The MemorySetterHandler with registered PowerCreep name.
     */
    powerCreep<T extends PowerCreepMemory = PowerCreepMemory>(name: string): MemorySetterHandler<T>;

    /**
     * Set FlagMemory with flag name.
     * @param name - name of Flag object
     * @returns The MemorySetterHandler with registered Flag name.
     */
    flag<T extends FlagMemory = FlagMemory>(name: string): MemorySetterHandler<T>;

    /**
     * Set RoomMemory with room name.
     * @param name - name of Room object
     * @returns The MemorySetterHandler with registered Room name.
     */
    room<T extends RoomMemory = RoomMemory>(name: string): MemorySetterHandler<T>;

    /**
     * Set SpawnMemory with spawn name.
     * @param name - name of StructureSpawn object
     * @returns The MemorySetterHandler with registered Spawn name.
     */
    spawn<T extends SpawnMemory = SpawnMemory>(name: string): MemorySetterHandler<T>;

    /**
     * Set ClusterMemory with cluster name.
     * @param name - name of Cluster object
     * @returns The MemorySetterHandler with registered Cluster name.
     */
    cluster<T extends ClusterMemory = ClusterMemory>(name: string): MemorySetterHandler<T>;

    /**
     * Set NodeMemory with node name.
     * @param name - name of Node object
     * @returns The MemorySetterHandler with registered Node name.
     */
    node<T extends NodeMemory = NodeMemory>(name: string): MemorySetterHandler<T>;

    /**
     * Set CreepMemory with unit name.
     * @param name - name of Unit object
     * @returns The MemorySetterHandler with registered Unit name.
     */
    unit<T extends UnitMemory = UnitMemory>(name: string): MemorySetterHandler<T>;
}

type MemoryIndex = "creeps" | "powerCreeps" | "flags" | "rooms" | "spawns" |
    "clusters" | "nodes" | "units";


interface MemorySetterHandler<T extends ObjectMemory = ObjectMemory> {
    as(memory: T): void;
}

interface MemoryComplement {
}
