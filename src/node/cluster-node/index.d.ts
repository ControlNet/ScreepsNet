/**
 * The ClusterNode is the node which represents the directly management from the cluster.
 */
interface ClusterNode extends Node {
    readonly type: ClusterNodeType;
}

type ClusterNodeType = "ClusterNode";

type ClusterNodeMemoryType = "ClusterNodeMemory";

interface ClusterNodeMemoryComplement extends MemoryComplement {

}
