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

export function getByKey(index: string): (obj: { [k: string]: any }) => any {
    return obj => obj[index];
}
