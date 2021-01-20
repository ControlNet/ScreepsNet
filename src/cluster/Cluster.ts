import { ClusterNodeImpl } from "../node/cluster-node/ClusterNode";
import { ControllerNodeImpl } from "../node/controller-node/ControllerNode";


export abstract class ClusterBase implements Cluster {
    protected readonly _name: string;
    protected readonly _home: Room;
    protected readonly _nodes: NodeMap;
    protected readonly _spawns: Array<SpawnNode>; // initialize this.spawns in builder
    protected readonly _sources: Array<SourceNode>;
    protected readonly _constructionSites: Array<ConstructionSite>;
    protected _controller?: ControllerNode;
    protected readonly _rooms: Array<Room>;
    protected _node?: ClusterNode;
    protected _topNodes: Array<TopNode>;
    protected _level: number;
    static readonly build: Builder<Cluster>;

    protected constructor(name: string, home: Room, fromMemory: boolean = true) {
        this._name = name;
        this._home = home;
        this._nodes = {};

        if (fromMemory) {
            this._topNodes = [];
            this._rooms = [];
        } else {
            this._node = ClusterNodeImpl.build.with(); // TODO: finishing the ClusterNodeImpl construction
            this._nodes[this.node.name] = this.node;

            this._topNodes = [this.node];
            this._rooms = [this.home];
            this._controller = ControllerNodeImpl.build.with(); //TODO: finishing the ControllerNodeImpl construction
        }

        this._spawns = [];
        this._sources = [];
        this._constructionSites = []
        this._level = this.home.controller?.level ?? -1;
    }

    /**
     * Run main loop of this cluster.
     */
    abstract run(): void;

    abstract get stage(): ClusterStage;

    abstract spawn(unit: Unit): void;

    /**
     * Save to memory
     * @protected
     */
    protected abstract save(): void;

    /**
     * Reconstruct nodes belongs to it.
     * @protected
     */
    protected abstract reconstructNodes(): void;

    /**
     * Scan unmarked RoomController, Source and Spawn.
     * @protected
     */
    protected abstract scan(): void;

    readonly get: ClusterGetter = {
        node: <T extends Node = Node>(name: string): T => <T>this.nodes[name]
    };

    readonly add: ClusterAdder = {
        node: <T extends Node = Node>(obj: T): void => {
            this.nodes[obj.name] = obj;
        }
    };

    abstract get type(): NetObjectType;

    get name(): string {
        return this._name;
    }

    get home(): Room {
        return this._home;
    }

    get nodes(): NodeMap {
        return this._nodes;
    }

    get spawns(): Array<SpawnNode> {
        return this._spawns;
    }

    get constructionSites(): Array<ConstructionSite> {
        return this._constructionSites;
    }

    get rooms(): Array<Room> {
        return this._rooms;
    }

    get node(): ClusterNode {
        if (this._node === undefined) {
            throw Error("Not defined cluster node in " + this.name)
        } else {
            return this._node;
        }
    }

    set node(value: ClusterNode) {
        this._node = value;
    }

    get level(): number {
        return this._level;
    }

    get topNodes(): Array<TopNode> {
        return this._topNodes;
    }

    set topNodes(value: Array<TopNode>) {
        this._topNodes = value;
    }

    get sources(): Array<SourceNode> {
        return this._sources;
    }

    get controller(): ControllerNode {
        if (this._controller === undefined) {
            throw Error("Not defined controller node in " + this.name)
        } else {
            return this._controller;
        }
    }

    set controller(value: ControllerNode) {
        this._controller = value;
    }
}

