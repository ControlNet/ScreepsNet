interface CentralCluster extends Cluster {
    readonly type: CentralClusterType;
}

interface CentralClusterMemoryComplement extends MemoryComplement {
}

type CentralClusterType = "CentralCluster";

type CentralClusterMemoryType = "CentralClusterMemory";


type CentralClusterStage = FOUNDING | EXPANDING | DEVELOPING | FINALIZING;

type FOUNDING = 0;
type EXPANDING = 1;
type DEVELOPING = 2;
type FINALIZING = 3;
