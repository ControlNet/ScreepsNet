interface SourceNode extends Node {
    /**
     * The name of SourceNode is the ID of the Source.
     */
    name: string;
    /**
     * The source object of this node.
     */
    readonly structure: Source;

    /**
     * The possible room position for harvesting.
     */
    readonly workingSlots: Array<RoomPosition>;

    /**
     * The number of possible working units.
     */
    readonly numberOfWorkingSlots: number;

    readonly flag?: Flag;
}

type SourceNodeType = "SourceNode";

type SourceNodeMemoryType = "SourceNodeMemory";

interface SourceNodeMemoryComplement extends MemoryComplement {
    numberOfWorkingSlots: number;

    workingSlots: Array<[number, number, string]>
}

interface SourceNodeMemory extends NodeMemory<SourceNodeMemoryComplement> {
    flagName: string;

    structureId: Id<Source>
}