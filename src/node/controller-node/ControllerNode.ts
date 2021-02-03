import { TopNodeBase } from "../Node";
import { ControllerNodeMemoryType, ControllerNodeType } from "./ControllerNodeType";
import { flagColors } from "../../utils/FlagColors";
import { generateNodeName } from "../NodeUtils";
import { MemoryIO } from "../../extensions/memory/MemoryIO";

export class ControllerNodeImpl extends TopNodeBase implements ControllerNode {
    protected readonly _structure: StructureController;
    protected readonly _flag: Flag;
    protected readonly _superNode = undefined;

    protected constructor(name: string, cluster: Cluster, structure: StructureController, flag?: Flag) {
        super(name, cluster, structure);
        this._structure = structure;

        if (flag === undefined) {
            Game.rooms[this.structure.pos.roomName]
                .createFlag(this.structure.pos, name, flagColors[this.type], flagColors[this.type])
            this._flag = Game.flags[this.name];
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
        MemoryIO.set.node<ControllerNodeMemory>(this.name).as({
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