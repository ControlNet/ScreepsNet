import { TopNodeBase } from "node/Node";
import { SpawnNodeMemoryType, SpawnNodeType } from "./SpawnNodeType";
import { generateNodeName } from "../NodeUtils";
import { flagColors } from "../../utils/FlagColors";
import { MemoryIO } from "../../extensions/memory/MemoryIO";
import { checkType, getByKey } from "../../utils/HelperFunctions";
import { ExtensionNodeType } from "../extension-node/ExtensionNodeType";


export class SpawnNodeImpl extends TopNodeBase implements SpawnNode {
    protected readonly _structure: StructureSpawn;
    protected readonly _superNode = undefined;
    protected readonly _flag: Flag;
    readonly plan: Array<SpawnPlan> = [];

    constructor(name: string, cluster: Cluster, structure: StructureSpawn, flag?: Flag, plan?: Array<SpawnPlan>) {
        super(name, cluster, structure);
        this._structure = structure;

        if (flag === undefined) {
            Game.rooms[this.structure.pos.roomName]
                .createFlag(this.structure.pos, name, flagColors[this.type], flagColors[this.type])
            this._flag = Game.flags[this.name];
        } else {
            this._flag = flag;
        }

        if (plan === undefined) {
            this.plan = [];
        } else {
            this.plan = plan;
        }
    }

    protected reconstructSubNodes(): void {
    }

    protected reconstructUnits(): void {
    }

    run(): void {
        this.reconstructSubNodes();
        this.reconstructUnits();

        this.serveQueue();
        this.save();
    }

    /**
     * Run this structure to spawn the creeps by queue
     * @private
     */
    private serveQueue(): void {
        if (this.plan.length > 0) {
            const {body, name, opts} = this.plan[0];

            if (this.structure.spawning === null) {
                const result = this.structure.spawnCreep(body, name, opts);

                // TODO: ERROR: plan to spawning 2 units in one tick
                switch (result) {
                    case OK:
                        this.plan.shift();
                        console.log(`${this.name}: Spawning ${name}!`)
                        break;
                    case ERR_BUSY:
                        break;
                    case ERR_NOT_ENOUGH_ENERGY:
                        break;
                    case ERR_RCL_NOT_ENOUGH:
                        throw Error(`${this.name}: RCL not enough!`);
                    default:
                        throw Error(`${this.name}: Unknown error ${result}!`);
                }
            }
        }
    }

    spawn(unit: Unit): void {
        this.plan.push({
            nodeName: unit.node.name, body: unit.body, name: unit.name, opts: unit.spawnOptions
        });
    }

    static readonly build: NodeBuilder<SpawnNode> = {
        with(cluster: Cluster, structure: StructureSpawn, name?: string, flag?: Flag, plan?: Array<SpawnPlan>): SpawnNode {
            if (name === undefined) {
                name = generateNodeName(SpawnNodeType)
            }

            return new SpawnNodeImpl(name, cluster, structure, flag, plan);
        },

        from(memory: SpawnNodeMemory, cluster: Cluster): SpawnNode {
            return this.with(
                cluster,
                Game.getObjectById(memory.structureId),
                memory.name,
                Game.flags[memory.flagName],
                memory.others.plan
            );
        },
    }

    protected save(): void {
        MemoryIO.set.node<SpawnNodeMemory>(this.name).as({
            name: this.name,
            flagName: this.flag.name,
            clusterName: this.cluster.name,
            memoryType: SpawnNodeMemoryType,
            structureId: this.structure.id,
            type: this.type,
            others: {
                plan: this.plan
            }
        })
    }

    hasFlag(): boolean {
        return true;
    }

    isTopNode(): boolean {
        return false;
    }

    isBusy(): boolean {
        return this.structure.spawning !== null;
    }

    queueLength(): number {
        return this.plan.length;
    }

    get structure(): StructureSpawn {
        return this._structure;
    }

    get type(): SpawnNodeType {
        return SpawnNodeType;
    }

    get flag(): Flag {
        return this._flag;
    }

    get cache(): Array<CacheStructure> {
        return [this.structure, ...this.subNodes.filter(checkType<ExtensionNode>(ExtensionNodeType)).map(getByKey<StructureExtension>("structure"))]
    }

}
