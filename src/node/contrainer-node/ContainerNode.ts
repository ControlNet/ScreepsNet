import { SubNodeBase } from "../Node";
import { ContainerNodeType } from "./ContainerNodeType";

export class ContainerNodeImpl extends SubNodeBase implements ContainerNode {

    run(...args: any[]): void {
    }

    protected save(): void {
    }

    get type(): ContainerNodeType {
        return ContainerNodeType;
    }

}