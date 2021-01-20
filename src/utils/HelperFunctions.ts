import _ from "lodash";
import { Reducer } from "./Reducer";

/**
 * A curried function able to generate a type predicate
 * that can check if the type of a input object is T or not.
 *
 * @param types - The type objects for filtering
 * @typeParam T - The target of type predicate.
 * @returns A type predicate.
 *
 * @example
 * // check if the node is SpawnNode
 * checkNetObjectType<SpawnNode>(SpawnNode)(node)
 *
 * // check if the node is TopNode (type TopNode = SpawnNode | ClusterNode) for example.
 * checkNetObjectType<TopNode>(SpawnNode, ClusterNode)(node)
 */
export function checkType<T extends (NetObject | NetObjectMemory)>(...types: Array<NetObjectType> | Array<MemoryType>): (value: NetObject | NetObjectMemory) => value is T {
    return (value): value is T => types.some((type: NetObjectType | MemoryType) => value.type === type);
}

/**
 * A curried function which can generate a index accessor for easier mapping in arrays.
 *
 * @param index - The key string that want to access.
 * @typeParam T - The value type of given key/index.
 * @returns A function mapping from object to that value with given key.
 *
 * @example
 * // map an Array of Node to their name
 * nodes.map(getByKey<string>("name"))
 */
export function getByKey<T>(index: string): (obj: { [k: string]: any }) => T {
    return obj => <T>obj[index];
}

export function coordinateAdd(...points: Array<Coordinate>): Coordinate {
    const getX = getByKey<number>("x");
    const getY = getByKey<number>("y");

    return {
        x: _.sum(points.map(getX)),
        y: _.sum(points.map(getY))
    }
}

export function compareRoomPosition(roomPosition1: RoomPosition, roomPosition2: RoomPosition) {
    return roomPosition1.roomName === roomPosition2.roomName &&
        roomPosition1.x === roomPosition2.x &&
        roomPosition1.y === roomPosition2.y
}

export function includeRoomPosition(array: Array<RoomPosition>, pos: RoomPosition): boolean {
    return array.some(each => compareRoomPosition(each, pos));
}

/**
 * Randomly generate one digit.
 * @returns: One digit (0-9).
 */
export function getRandomDigit(): number {
    return Math.min(Math.floor(Math.random() * 10), 9);
}

/**
 * Randomly generate a series of random digits
 * @param n - The length of generated digits.
 */
export function generateRandomNumString(n: number): string {
    return _.range(0, n).map(getRandomDigit)
        .map(digit => digit.toString())
        .reduce(Reducer.strcat);
}