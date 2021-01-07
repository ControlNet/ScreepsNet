interface ControllerNode extends Node {
    readonly type: ControllerNodeType;
}

type ControllerNodeType = "ControllerNode";

type ControllerNodeMemoryType = "ControllerNodeMemory";