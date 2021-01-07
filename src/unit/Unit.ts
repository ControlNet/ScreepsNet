export abstract class UnitBase implements Unit {
    protected readonly _name: string;
    protected creep?: Creep;
    protected _body: UnitBody;
    protected _spawned: boolean;
    protected readonly _cluster: Cluster;
    protected readonly _spawnOptions: SpawnOptions;

    /**
     * Builder
     * @protected
     */
    static readonly build: Builder<Unit>;

    abstract run(): void

    protected constructor(body: UnitBody, name: string, cluster: Cluster, options: SpawnOptions) {
        this._body = body;
        this._name = name;
        this._spawned = false;
        this._cluster = cluster;
        this._spawnOptions = options;
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

    get spawnOptions(): SpawnOptions {
        return this._spawnOptions;
    }

    /**
     * Save to memory.
     * @protected
     */
    protected abstract save(): void;

    say(message: string, toPublic?: boolean): void {
        this.creep?.say(message, toPublic);
    }
}