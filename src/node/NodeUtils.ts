import { ClusterNodeMemoryType, ClusterNodeType } from "./cluster-node/ClusterNodeType";
import { ControllerNodeMemoryType, ControllerNodeType } from "./controller-node/ControllerNodeType";
import { SourceNodeMemoryType, SourceNodeType } from "./source-node/SourceNodeType";
import { SpawnNodeMemoryType, SpawnNodeType } from "./spawn-node/SpawnNodeType";
import { ContainerNodeMemoryType, ContainerNodeType } from "./contrainer-node/ContainerNodeType";
import { generateRandomNumString, getByKey } from "../utils/HelperFunctions";

export const TopNodeTypes: Array<TopNodeType> = [ClusterNodeType, ControllerNodeType, SourceNodeType, SpawnNodeType]

export const SubNodeTypes: Array<SubNodeType> = [ContainerNodeType]

export const TopNodeMemoryTypes: Array<TopNodeMemoryType> = [
    ClusterNodeMemoryType, ControllerNodeMemoryType, SourceNodeMemoryType, SpawnNodeMemoryType
]

export const SubNodeMemoryTypes: Array<SubNodeMemoryType> = [ContainerNodeMemoryType];

export function generateNodeName(type: NodeType): string {
    const name: string = type + generateRandomNumString(4);

    // check validation of the name.
    if (Memory.get.all.nodes.map(getByKey<string>("name")).includes(name)) {
        // if the name has been in the existed nodes, re-generate one.
        return generateNodeName(type);
    } else {
        // else return the name as final result.
        return name;
    }
}