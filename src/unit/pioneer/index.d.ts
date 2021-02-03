interface Pioneer extends Unit {
    status: PioneerState;

    type: PioneerType;

    /**
     * The node of this pioneer unit belongs to.
     */
    node: ClusterNode;

    /**
     * The controller of this pioneer unit need to be upgraded.
     */
    controller: StructureController;

    /**
     * The source structure for this pioneer to harvest.
     */
    source: Source;

    /**
     * The source slot, which is the harvest position, of this pioneer.
     */
    sourceSlot: RoomPosition;
}

type PioneerType = "Pioneer";

/**
 * The status of Pioneer
 */
type PioneerState = HARVESTING | UPGRADING | CONSTRUCTING | DELIVERING;
type HARVESTING = 0;
type UPGRADING = 1;
type CONSTRUCTING = 2;
type DELIVERING = 3;


/**
 * The complement memory for Pioneer saved to memory
 */
interface PioneerMemoryComplement extends MemoryComplement {
    controllerRoomName: string;
    sourceId: Id<Source>;
    status: PioneerState;

    slotX: number;
    slotY: number;
    slotRoomName: string;
}

type PioneerMemoryType = "PioneerMemory";
