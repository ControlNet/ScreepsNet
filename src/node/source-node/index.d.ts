interface SourceNode extends Node {
    /**
     * The name of SourceNode is the ID of the Source.
     */
    name: Id<Source>;
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
}

type SourceNodeType = "SourceNode";

type SourceNodeMemoryType = "SourceNodeMemory";