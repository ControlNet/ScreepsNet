interface RoomPosition {
    /**
     * Get the neighbour positions of the Room Position.
     */
    getNeighbours(): Array<RoomPosition>;

    /**
     * Get the neighbour positions of the Room Position, and only filter the position is not WALL.
     */
    getNonBlockNeighbours(): Array<RoomPosition>;
}