/**
 * The Node is the base buildings of a cluster.
 * It can be energy source, room controller, spawn-node, etc.
 */
interface Node extends NetObject {
    /**
     * The father node controlling the node.
     * It can be null if it is a TopNode.
     */
    readonly superNode?: Node;

    /**
     * Get if the node is a top node (does not has a super node).
     */
    isTopNode(): boolean;

    /**
     * The cluster that the node belongs to.
     */
    readonly cluster: Cluster;

    /**
     * The structure of this node.
     */
    readonly structure: NodeStructure;

    /**
     * An array of units assigned to this node.
     */
    readonly units?: Array<Unit>;

    /**
     * An array of sub nodes assigned to this node.
     */
    readonly subNodes?: Array<SubNode>;

    /**
     * The the flag indicating the node. It can be null.
     */
    readonly flag?: Flag;

    /**
     * Get if the node has flag or not.
     */
    hasFlag(): boolean;

    /**
     * Get room position.
     */
    readonly pos: RoomPosition;

    /**
     * The home room of the cluster.
     */
    readonly home: Room;

    /**
     * The type of the node.
     */
    readonly type: NodeType;
}

type NodeStructure = Structure | Source | Mineral
type NodeType = TopNodeType | SubNodeType;

// TODO more node type for TopNode and SubNode
type TopNode = ClusterNode | SpawnNode | ControllerNode | SourceNode;
type SubNode = ContainerNode;

// TODO more node type for TopNode and SubNode
type TopNodeType = ClusterNodeType | SpawnNodeType | ControllerNodeType | SourceNodeType;
type SubNodeType = ContainerNodeType;

interface NodeMemory<T extends MemoryComplement = MemoryComplement> extends NetObjectMemory {
    type: NodeType;

    memoryType: NodeMemoryType;

    clusterName: string;

    others: T;
}

interface TopNodeMemory<T extends MemoryComplement = MemoryComplement> extends NodeMemory<T> {
    type: TopNodeType;

    flagName?: string;
}

interface SubNodeMemory<T extends MemoryComplement = MemoryComplement> extends NodeMemory<T> {
    type: SubNodeType;

    superNodeName: string;
}

/**
 * The string of memory type for Node.
 */
type NodeMemoryType = TopNodeMemoryType | SubNodeMemoryType;


// TODO more node type for TopNode and SubNode
type TopNodeMemoryType = ClusterNodeMemoryType | SpawnNodeMemoryType | ControllerNodeMemoryType | SourceNodeMemoryType;
type SubNodeMemoryType = ContainerNodeMemoryType;
