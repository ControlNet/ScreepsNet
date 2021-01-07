import { ClusterNodeImpl } from "./cluster-node/ClusterNode";
import { SpawnNodeImpl } from "./spawn-node/SpawnNode";
import { ControllerNodeImpl } from "./controller-node/ControllerNode";
import { SourceNodeImpl } from "./source-node/SourceNode";
import { ContainerNodeImpl } from "./contrainer-node/ContainerNode";

export const TopNodeImpls = [ClusterNodeImpl, SpawnNodeImpl, ControllerNodeImpl, SourceNodeImpl];

export const SubNodeImpls = [ContainerNodeImpl];