export abstract class NodeBase implements Node {
    protected readonly _name: string;
    protected readonly _cluster: Cluster;
    protected readonly _units: Array<Unit> = [];
    protected readonly _flag?: Flag;
    protected readonly _structure: NodeStructure;
    protected readonly _superNode?: Node;

    constructor(name: string, cluster: Cluster, structure: NodeStructure, flag?: Flag, superNode?: Node) {
        this._name = name;
        this._cluster = cluster;
        this._structure = structure;
        this._flag = flag;
        this._superNode = superNode;
    }

    /**
     * The builder object to construct the objects in future ticks.
     */
    static readonly build: Builder<Node>;

    abstract run(...args: any[]): void

    /**
     * Save in memory.
     * @protected
     */
    protected abstract save(): void;

    /**
     * Get the stage of the cluster which the node belongs to.
     * @protected
     */
    protected get stage(): ClusterStage {
        return this.cluster.stage;
    }

    get name(): string {
        return this._name;
    }

    get cluster(): Cluster {
        return this._cluster;
    }

    get units(): Array<Unit> {
        return this._units;
    }

    get flag(): Flag | undefined {
        return this._flag;
    }

    get structure(): NodeStructure {
        return this._structure;
    }

    get superNode(): Node | undefined {
        return this._superNode;
    }

    get pos(): RoomPosition {
        return this.structure.pos;
    }

    get home(): Room {
        return this.cluster.home;
    }

    hasFlag(): boolean {
        return this._flag === undefined;
    }

    isTopNode(): boolean {
        return this._superNode === undefined;
    }
}

export abstract class TopNodeBase extends NodeBase {
    protected readonly _subNodes!: Array<SubNode>;
    protected readonly _superNode = undefined;

    abstract run(clusterType: ClusterType, stage: ClusterStage): void

    /**
     * Reconstruct sub nodes of this node from memory.
     * @protected
     */
    protected abstract reconstructSubNodes(): void;
    /**
     * Reconstruct units of this node from memory.
     * @protected
     */
    protected abstract reconstructUnits(): void;

    get subNodes(): Array<SubNode> {
        return this._subNodes;
    }

    isTopNode(): boolean {
        return true;
    }
}

export abstract class SubNodeBase extends NodeBase {
    get subNodes(): undefined{
        return undefined
    };
}