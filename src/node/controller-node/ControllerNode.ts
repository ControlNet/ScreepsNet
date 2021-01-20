import { TopNodeBase } from "../Node";
import { ControllerNodeMemoryType, ControllerNodeType } from "./ControllerNodeType";
import { flagColors } from "../../utils/FlagColors";
import { generateRandomNumString } from "../../utils/HelperFunctions";
import { generateNodeName } from "../NodeUtils";

export class ControllerNodeImpl extends TopNodeBase implements ControllerNode {
    protected readonly _structure: StructureController;
    protected readonly _flag: Flag;
    protected readonly _superNode = undefined;

    protected constructor(name: string, cluster: Cluster, structure: StructureController, flag?: Flag) {
        super(name, cluster, structure);
        this._structure = structure;

        if (flag === undefined) {
            const {roomName, x, y} = this.structure.pos;
            this._flag = new Flag(name, flagColors[this.type], flagColors[this.type], roomName, x, y);
        } else {
            this._flag = flag;
        }
    }

    protected reconstructSubNodes(): void {
    }

    protected reconstructUnits(): void {
    }

    run(clusterType: ClusterType, stage: ClusterStage): void {
        this.reconstructSubNodes();
        this.reconstructUnits();

        this.save();
    }

    static readonly build: NodeBuilder<ControllerNodeImpl> = {

        with(cluster: Cluster, structure: StructureController, name?: string, flag?: Flag): ControllerNodeImpl {
            if (name === undefined) {
                name = generateNodeName(ControllerNodeType);
            }

            return new ControllerNodeImpl(name, cluster, structure, flag);
        },

        from(memory: ControllerNodeMemory, cluster: Cluster): ControllerNodeImpl {
            return this.with(
                cluster,
                Game.getObjectById(memory.structureId),
                memory.name,
                Game.flags[memory.flagName]
            );
        }
    }

    protected save(): void {
        Memory.set.node<ControllerNodeMemory>(this.name).as({
            name: this.name,
            clusterName: this.cluster.name,
            flagName: this.flag.name,
            memoryType: ControllerNodeMemoryType,
            structureId: this.structure.id,
            type: this.type,
            others: {}
        })
    }

    hasFlag(): boolean {
        return true;
    }

    get type(): ControllerNodeType {
        return ControllerNodeType;
    }

    get structure(): StructureController {
        return this._structure;
    }

    get flag(): Flag {
        return this._flag;
    }


}