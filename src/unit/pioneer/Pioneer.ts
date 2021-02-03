import { UnitBase } from "../Unit";
import { emoji } from "../../utils/Emoji";
import { CONSTRUCTING, DELIVERING, HARVESTING, UPGRADING } from "./PioneerStatus";
import { PioneerMemoryType, PioneerType } from "./PioneerType";
import { compareRoomPosition, generateRandomNumString } from "../../utils/HelperFunctions";
import { generateUnitName } from "../UnitUtils";
import { MemoryIO } from "../../extensions/memory/MemoryIO";

export class PioneerImpl extends UnitBase implements Pioneer {
    protected readonly _node: ClusterNode;
    private readonly _controller: StructureController;
    private readonly _source: Source;
    private readonly _sourceSlot: RoomPosition;
    private _status: PioneerState;

    protected constructor(body: UnitBody, name: string, cluster: Cluster, options: SpawnOptions, node: ClusterNode,
                          controller: StructureController, source: Source, sourceSlot: RoomPosition, creep?: Creep) {
        super(body, name, node, cluster, options);
        this._node = node;
        this._controller = controller;
        this._source = source;
        this._sourceSlot = sourceSlot;
        this._status = HARVESTING;
        this.creep = creep;
    }

    run(): void {
        // if the creep is not spawned, skip this tick.
        if (this.spawned) {
            // main loop
            this.checkStatus();

            switch (this.status) {
                case HARVESTING:
                    this.harvest();
                    break;
                case UPGRADING:
                    this.upgrade();
                    break;
                case CONSTRUCTING:
                    this.construct();
                    break;
                case DELIVERING:
                    this.deliver();
                    break;
            }
        } else {
            this.checkSpawned();
        }

        // save to the memory
        this.save();
    }

    /**
     * Check the status of the unit, and switch it if necessary.
     * @private
     */
    private checkStatus() {
        // changing state
        switch (this.status) {
            case HARVESTING:
                // when the creep get full capacity of resource
                if (this.creep?.store.getFreeCapacity() === 0) {
                    // try to fill the spawn
                    this.status = DELIVERING;
                }
                break;
            case UPGRADING:
                // when finishing an upgrading process, switch to harvest
                if (this.creep?.store[RESOURCE_ENERGY] === 0) {
                    this.status = HARVESTING;
                }
                break;
            case CONSTRUCTING:
                // when finishing an construction process, switch to harvest
                if (this.creep?.store[RESOURCE_ENERGY] === 0) {
                    this.status = HARVESTING;
                }
                break;
            case DELIVERING:
                if (this.creep?.store[RESOURCE_ENERGY] === 0) {
                    this.status = HARVESTING;
                }
                // check valid spawn cache targets
                const targets = this.cluster.spawns
                    .flatMap(spawnNode => spawnNode.cache)
                    .filter(spawn => spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0);

                // if the spawn is already filled
                if (targets.length === 0) {
                    // check the valid constructionSites
                    if (this.cluster.constructionSites.length !== 0) {
                        // if there is some building sites available
                        this.status = CONSTRUCTING;
                    } else {
                        // if no building sites available
                        this.status = UPGRADING;
                    }
                }
                break;
        }
    }

    private harvest(): void {
        if (!compareRoomPosition(this.creep!.pos, this.sourceSlot)) {
            // if the creep is not in the harvest position
            // move to the target
            this.creep?.travelTo(this.sourceSlot);
        } else {
            // else start harvesting
            this.creep?.harvest(this.source);
        }
    }

    private upgrade(): void {
        if (this.creep?.upgradeController(this.controller) === ERR_NOT_IN_RANGE) {
            this.creep?.travelTo(this.controller);
        }
    }

    private construct(): void {
        const target = this.cluster.constructionSites[0];

        if (this.creep?.build(target) === ERR_NOT_IN_RANGE) {
            this.creep?.travelTo(target);
        }
    }

    private deliver(): void {
        const targets = this.cluster.spawns.flatMap(spawnNode => spawnNode.cache);

        if (this.creep?.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this.creep?.travelTo(targets[0]);
        }
    }

    static readonly build: Builder<Pioneer> = {
        with(body: UnitBody,
             cluster: Cluster,
             node: ClusterNode,
             controller: StructureController,
             source: Source,
             sourceSlot: RoomPosition,
             name?: string,
             memory?: CreepMemory,
             energyStructures?: Array<StructureExtension>,
             dryRun?: boolean,
             directions?: Array<DirectionConstant>): Pioneer {

            if (name === undefined) {
                name = generateUnitName(PioneerType);
            }

            return new PioneerImpl(body, name, cluster, {memory, energyStructures, dryRun, directions},
                node, controller, source, sourceSlot);
        },

        from(memory: UnitMemory<PioneerMemoryComplement>, cluster: Cluster, node: Node): Pioneer {
            const obj = this.with(
                memory.body,
                cluster,
                node,
                Game.rooms[memory.others.controllerRoomName].controller!,
                Game.getObjectById(memory.others.sourceId)!,
                new RoomPosition(memory.others.slotX, memory.others.slotY, memory.others.slotRoomName),
                memory.name,
                memory.spawnOptions.memory,
                memory.spawnOptions.energyStructures,
                memory.spawnOptions.dryRun,
                memory.spawnOptions.directions
            )

            obj.status = memory.others.status;
            obj.spawned = memory.spawned;
            obj.creep = Game.creeps[memory.name];

            return obj;
        }
    }

    get node(): ClusterNode {
        return this._node;
    }

    get controller(): StructureController {
        return this._controller;
    }

    get source(): Source {
        return this._source;
    }

    get sourceSlot(): RoomPosition {
        return this._sourceSlot;
    }

    get status(): PioneerState {
        return this._status;
    }

    set status(newState: PioneerState) {
        switch (newState) {
            case HARVESTING:
                this.say(emoji.mining + "HARVEST");
                break;
            case UPGRADING:
                this.say(emoji.upgrading + "UPGRADE");
                break;
            case CONSTRUCTING:
                this.say(emoji.building + "CONSTRUCT");
                break;
            case DELIVERING:
                this.say(emoji.delivering + "DELIVER");
                break;
        }
        this._status = newState;
    }

    get type(): PioneerType {
        return PioneerType;
    }

    save(): void {
        MemoryIO.set.unit<UnitMemory<PioneerMemoryComplement>>(this.name).as({
            name: this.name,
            body: this.body,
            spawnOptions: this.spawnOptions,
            spawned: this.spawned,
            clusterName: this.cluster.name,
            type: this.type,
            nodeName: this.node.name,
            memoryType: PioneerMemoryType,

            others: {
                controllerRoomName: this.controller.room.name,
                sourceId: this.source.id,
                status: this.status,

                slotX: this.sourceSlot.x,
                slotY: this.sourceSlot.y,
                slotRoomName: this.sourceSlot.roomName,
            }
        });
    }

}


