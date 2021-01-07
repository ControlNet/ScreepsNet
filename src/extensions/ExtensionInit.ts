import { initMemoryExt } from "./memory/MemoryExt";
import { initRoomPositionExt } from "./room-position/RoomPositionExt";

export function extensionInit() {
    initMemoryExt();
    initRoomPositionExt()
}
