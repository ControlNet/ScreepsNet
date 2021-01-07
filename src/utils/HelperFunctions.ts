import _ from "lodash";

/**
 * A curried function able to generate a type predicate
 * that can check if the type of a input object is T or not.
 *
 * @param types - The constructors used for checking.
 * @typeParam T - The target of type predicate.
 * @returns A type predicate.
 *
 * @example
 * // check if the node is SpawnNode
 * checkType<SpawnNode>(SpawnNodeImpl)(node)
 *
 * // check if the node is TopNode (type TopNode = SpawnNode | ClusterNode) for example.
 * checkType<TopNode>)(SpawnNodeImpl, ClusterNodeImpl)(node)
 */
export function checkType<T>(...types: { new(...args: any[]): any }[]): (value: any) => value is T {
    return (value): value is T => types.some(type => value instanceof type);
}

/**
 * A similar function to `checkType` but more suitable for NetObject or NetObjectMemory objects
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
export function checkNetObjType<T extends (NetObject | NetObjectMemory)>(...types: Array<NetObjectType> | Array<MemoryType>): (value: NetObject | NetObjectMemory) => value is T {
    return (value): value is T => types.some(type => value.type === type);
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