import { ClusterNodeMemoryType, ClusterNodeType } from "./cluster-node/ClusterNodeType";
import { ControllerNodeMemoryType, ControllerNodeType } from "./controller-node/ControllerNodeType";
import { SourceNodeMemoryType, SourceNodeType } from "./source-node/SourceNodeType";
import { SpawnNodeMemoryType, SpawnNodeType } from "./spawn-node/SpawnNodeType";
import { ContainerNodeMemoryType, ContainerNodeType } from "./contrainer-node/ContainerNodeType";

export const TopNodeTypes: Array<TopNodeType> = [ClusterNodeType, ControllerNodeType, SourceNodeType, SpawnNodeType]

export const SubNodeTypes: Array<SubNodeType> = [ContainerNodeType]

export const TopNodeMemoryTypes: Array<TopNodeMemoryType> = [
    ClusterNodeMemoryType, ControllerNodeMemoryType, SourceNodeMemoryType, SpawnNodeMemoryType
]

export const SubNodeMemoryTypes: Array<SubNodeMemoryType> = [ContainerNodeMemoryType];
