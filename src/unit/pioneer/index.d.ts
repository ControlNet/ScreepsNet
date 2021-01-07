interface Pioneer extends Unit {
    status: PioneerState;

    type: PioneerType;
}

type PioneerType = "Pioneer";

/**
 * The status of Pioneer
 */
type PioneerState = HARVESTING | UPGRADING | CONSTRUCTING;
type HARVESTING = 0;
type UPGRADING = 1;
type CONSTRUCTING = 2;


/**
 * The complement memory for Pioneer saved to memory
 */
interface PioneerMemoryComplement extends MemoryComplement {
    controllerRoomName: string;
    sourceId: Id<Source>;
    status: PioneerState;
}

type PioneerMemoryType = "PioneerMemory";


