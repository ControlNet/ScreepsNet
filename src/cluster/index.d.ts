/**
 * The Cluster is the components of Network and a cluster can control everything in a colony.
 */
interface Cluster extends NetObject {
    /**
     * The link to the home room of this cluster.
     */
    readonly home: Room;
    /**
     * The rooms managed by this cluster.
     */
    readonly rooms: Array<Room>;
    /**
     * A dict storing all Node objects contained by this cluster.
     */
    readonly nodes: NodeMap;
    /**
     * The getter in the cluster for accessing the objects.
     */
    readonly get: ClusterGetter;
    /**
     * The adder in the cluster for adding objects in the cluster.
     */
    readonly add: ClusterAdder;
    /**
     * The link to the cluster node of this cluster.
     */
    node: ClusterNode;
    /**
     * The directly managed nodes (top nodes).
     */
    topNodes: Array<TopNode>;
    /**
     * The quick link to spawn-node nodes.
     */
    readonly spawns: Array<SpawnNode>;
    /**
     * The quick link to the construction sites of this cluster.
     */
    readonly constructionSites: Array<ConstructionSite>;
    /**
     * The quick link to all source node belonging to this cluster.
     */
    readonly sources: Array<SourceNode>
    /**
     * The quick link to the main controller.
     */
    readonly controller: ControllerNode;

    /**
     * Room level
     */
    level: number;
    /**
     * The stage of the cluster, which can let cluster choose different behaviors.
     */
    stage: ClusterStage;
    /**
     * The main loop of this cluster.
     */
    run(): void;
}

/**
 * NodeMap is the KV-pairs can get Node with given name.
 */
type NodeMap = {[name: string]: Node};

/**
 * The object getter of Cluster.
 */
interface ClusterGetter {
    /**
     * Get Node object with given name.
     * @param name - The Node name
     * @typeParam T - The target type of T
     */
    node<T extends Node = Node>(name: string): T;
}

/**
 * The object adder of Cluster
 */
interface ClusterAdder {
    /**
     * Add Node object
     */
    node<T extends Node = Node>(obj: T): void;
}

/**
 * The String that indicates the type of cluster
 */
type ClusterType = "CentralCluster" // TODO: Add more in the future

/**
 * The ClusterMemory stores everything about the cluster to Memory.
 */
interface ClusterMemory<T extends MemoryComplement = MemoryComplement> extends NetObjectMemory {
    type: ClusterType;
    memoryType: ClusterMemoryType;
    /**
     * The name of home room of this cluster.
     */
    homeRoomName: string;
    /**
     * All names of rooms controlled by this cluster.
     */
    roomsNames: Array<string>;
    /**
     * All names of nodes contained by this cluster.
     */
    nodesNames: Array<string>;
    /**
     * The name of related ClusterNode.
     */
    nodeName: string;
    /**
     * All id of construction sites managed by this cluster.
     */
    constructionSitesIds: Array<string>;
    /**
     * Other information might needed for some subclass of Cluster.
     */
    others: T;
}

/**
 * The string type of ClusterMemory.
 */
type ClusterMemoryType = CentralClusterMemoryType; // TODO: add more in the future

/**
 * The ClusterStage indicates the stage of the cluster.
 */
type ClusterStage = CentralClusterStage;  // TODO: add more in the future.