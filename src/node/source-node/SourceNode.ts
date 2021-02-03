import { TopNodeBase } from "../Node";
import { flagColors } from "../../utils/FlagColors";
import { SourceNodeMemoryType, SourceNodeType } from "./SourceNodeType";
import { generateNodeName } from "../NodeUtils";
import { MemoryIO } from "../../extensions/memory/MemoryIO";

export class SourceNodeImpl extends TopNodeBase implements SourceNode {

    protected readonly _flag: Flag;
    protected readonly _structure: Source;

    private readonly _numberOfWorkingSlots: number;
    private readonly _workingSlots: Array<RoomPosition>;


    constructor(name: string, cluster: Cluster, structure: Source, flag?: Flag,
                numberOfWorkingSlots?: number, workingSlots?: Array<RoomPosition>) {
        super(name, cluster, structure, flag);

        this._structure = structure;

        if (numberOfWorkingSlots === undefined || workingSlots === undefined) {
            this._workingSlots = this.structure.pos.getNonBlockNeighbours();
            this._numberOfWorkingSlots = this._workingSlots.length;
        } else {
            this._workingSlots = workingSlots;
            this._numberOfWorkingSlots = numberOfWorkingSlots;
        }

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

    static readonly build: NodeBuilder<SourceNode> = {
        with(cluster: Cluster, structure: Source, name?: string, flag?: Flag,
             numberOfWorkingSlots?: number, workingSlots?: Array<RoomPosition>): SourceNode {
            if (name === undefined) {
                name = generateNodeName(SourceNodeType);
            }

            return new SourceNodeImpl(name, cluster, structure, flag, numberOfWorkingSlots, workingSlots);
        },

        from(memory: SourceNodeMemory, cluster: Cluster): SourceNode {
            return new SourceNodeImpl(
                memory.name,
                cluster,
                Game.getObjectById(memory.structureId)!,
                Game.flags[memory.flagName],
                memory.others.numberOfWorkingSlots,
                memory.others.workingSlots.map(([x, y, roomName]) => new RoomPosition(x, y, roomName))
            );
        }

    }

    protected save(): void {
        MemoryIO.set.node<SourceNodeMemory>(this.name).as({
            name: this.name,
            type: this.type,
            clusterName: this.cluster.name,
            flagName: this.flag.name,
            memoryType: SourceNodeMemoryType,
            structureId: this.structure.id,
            others: {
                numberOfWorkingSlots: this.numberOfWorkingSlots,
                workingSlots: this.workingSlots.map(({x, y, roomName}) => [x, y, roomName])
            }
        })
    }

    hasFlag(): boolean {
        return true;
    }

    get type(): SourceNodeType {
        return SourceNodeType;
    }

    get numberOfWorkingSlots(): number {
        return this._numberOfWorkingSlots;
    }

    get workingSlots(): Array<RoomPosition> {
        return this._workingSlots;
    }

    get flag(): Flag {
        return this._flag;
    }

    get structure(): Source {
        return this._structure;
    }
}