import { UnitBase } from "../Unit";
import { emoji } from "../../utils/Emoji";
import { CONSTRUCTING, HARVESTING, UPGRADING } from "./PioneerStatus";
import { PioneerMemoryType, PioneerType } from "./PioneerType";
import { generateRandomNumString } from "../../utils/HelperFunctions";
import { generateUnitName } from "../UnitUtils";

export class PioneerImpl extends UnitBase implements Pioneer {
    private readonly _node: ClusterNode;
    private readonly _controller: StructureController;
    private readonly _source: Source;
    private readonly _sourceSlot: RoomPosition;
    private _status: PioneerState;

    protected constructor(body: UnitBody, name: string, cluster: Cluster, options: SpawnOptions, node: ClusterNode,
                          controller: StructureController, source: Source, sourceSlot: RoomPosition) {
        super(body, name, cluster, options);
        this._node = node;
        this._controller = controller;
        this._source = source;
        this._sourceSlot = sourceSlot;
        this._status = HARVESTING;
    }

    run(): void {
        // if the creep is not spawned, skip this tick.
        if (!this.spawned) {
            return;
        }
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
                    if (this.cluster.constructionSites.length !== 0) {
                        // if there is some building sites available
                        this.status = CONSTRUCTING;
                    } else {
                        // if no construction sites, continue to upgrade controller
                        this.status = UPGRADING;
                    }
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
        }
    }

    private harvest(): void {
        if (this.creep?.harvest(this.source) === ERR_NOT_IN_RANGE) {
            this.creep?.travelTo(this.source);
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
                this.say(emoji.mining + "HARVESTING")
                break;
            case UPGRADING:
                this.say(emoji.upgrading + "UPGRADING")
                break;
            case CONSTRUCTING:
                this.say(emoji.building + "CONSTRUCTING")
                break;
        }
        this._status = newState;
    }

    get type(): PioneerType {
        return PioneerType;
    }

    save(): void {
        Memory.set.unit<UnitMemory<PioneerMemoryComplement>>(this.name).as({
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


