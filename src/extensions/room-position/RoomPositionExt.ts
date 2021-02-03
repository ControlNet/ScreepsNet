import { coordinateAdd } from "../../utils/HelperFunctions";
import _ from "lodash";

export function initRoomPositionExt() {

    RoomPosition.prototype.getNeighbours = function(): Array<RoomPosition> {
        const offsets: Array<Coordinate> = [
            {x: -1, y: -1}, {x: +0, y: -1}, {x: +1, y: -1},
            {x: -1, y: +0}, {x: +1, y: +0},
            {x: -1, y: +1}, {x: +0, y: +1}, {x: +1, y: +1}
        ];

        return offsets.map(offset => coordinateAdd(this, offset))
            // filter the positions out of the room boundary.
            // range {(x, y) | 1 <= x <= 48, 1 <= y <= 48}
            .filter(coordinate => _.inRange(coordinate.x, 1, 49) && _.inRange(coordinate.y, 1, 49))
            // generate new RoomPosition as output
            .map(coordinate => new RoomPosition(coordinate.x, coordinate.y, this.roomName))
    }

    RoomPosition.prototype.getNonBlockNeighbours = function(): Array<RoomPosition> {
        return this.getNeighbours()
            .filter(pos => Game.rooms[pos.roomName].getTerrain().get(pos.x, pos.y) !== TERRAIN_MASK_WALL)
    }

}
