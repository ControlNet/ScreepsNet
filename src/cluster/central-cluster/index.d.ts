interface CentralCluster extends Cluster {
}

interface CentralClusterMemoryComplement extends MemoryComplement {
}


type CentralClusterStage = FOUNDING | EXPANDING | DEVELOPING | FINALIZING;

type FOUNDING = 0;
type EXPANDING = 1;
type DEVELOPING = 2;
type FINALIZING = 3;
