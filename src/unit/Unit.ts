import _ from "lodash";

export abstract class UnitBase implements Unit {
    protected readonly _name: string;
    protected _creep?: Creep;
    protected _body: UnitBody;
    protected _spawned: boolean;
    protected readonly _cluster: Cluster;
    protected readonly _node: TopNode;
    protected readonly _spawnOptions: SpawnOptions;

    /**
     * Builder
     * @protected
     */
    static readonly build: Builder<Unit>;

    abstract run(): void

    abstract save(): void;

    abstract get type(): UnitType;

    protected constructor(body: UnitBody, name: string, node: TopNode, cluster: Cluster, options: SpawnOptions) {
        this._body = body;
        this._name = name;
        this._node = node;
        this._spawned = false;
        this._cluster = cluster;
        this._spawnOptions = options;
    }

    /**
     * Check if the unit is spawned successfully.
     * @protected
     */
    protected checkSpawned() {
        if (_.keys(Game.creeps).includes(this.name) && !Game.creeps[this.name].spawning) {
            this.spawned = true;
            this._creep = Game.creeps[this.name];
        }
    }

    get body(): UnitBody {
        return this._body;
    }

    get name(): string {
        return this._name;
    }

    get spawned(): boolean {
        return this._spawned;
    }

    set spawned(value: boolean) {
        this._spawned = value;
    }

    get cluster(): Cluster {
        return this._cluster;
    }

    get node(): TopNode {
        return this._node;
    }

    get spawnOptions(): SpawnOptions {
        return this._spawnOptions;
    }

    get creep(): Creep | undefined {
        return this._creep;
    }

    set creep(value: Creep | undefined) {
        this._creep = value;
    }

    say(message: string, toPublic?: boolean): void {
        this._creep?.say(message, toPublic);
    }
}