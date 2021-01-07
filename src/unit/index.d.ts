/**
 * The Unit in ScreepsNet is a base type for creeps.
 */
interface Unit extends NetObject {

    /**
     * The body parts array of this unit.
     */
    readonly body: UnitBody;

    /**
     * The spawn options for spawning.
     */
    readonly spawnOptions: SpawnOptions;

    /**
     * The bool if the creep is spawned or still in plan.
     */
    spawned: boolean;

    /**
     * The cluster the unit belongs to.
     */
    readonly cluster: Cluster;

    /**
     * Let the creep say something
     */
    say(message: string, toPublic?: boolean): void;
}

type UnitBody = Array<BodyPartConstant>;

interface UnitMemory<T extends MemoryComplement = MemoryComplement> extends NetObjectMemory {
    /**
     * The body part array of this unit.
     */
    body: UnitBody;
    /**
     * Spawn options for this unit to spawn.
     */
    spawnOptions: SpawnOptions;
    /**
     * It indicates if the unit is spawned or planning to spawn.
     */
    spawned: boolean;
    /**
     * The cluster name belongs to.
     */
    clusterName: string;
    /**
     * The node name belongs to.
     */
    nodeName: string;
    /**
     * Other information might needed for some subclass of Unit.
     */
    others: T;
}