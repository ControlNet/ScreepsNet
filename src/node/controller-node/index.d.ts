interface ControllerNode extends Node {
    readonly type: ControllerNodeType;

    readonly structure: StructureController;

    readonly flag: Flag;
}

type ControllerNodeType = "ControllerNode";

type ControllerNodeMemoryType = "ControllerNodeMemory";

interface ControllerNodeMemoryComplement extends MemoryComplement {
}

interface ControllerNodeMemory extends TopNodeMemory<ControllerNodeMemoryComplement> {
    flagName: string;

    structureId: Id<StructureController>
}