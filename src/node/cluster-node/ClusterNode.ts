import { TopNodeBase } from "../Node";
import { PioneerImpl } from "../../unit/pioneer/Pioneer";
import { checkType, getByKey, includeRoomPosition } from "../../utils/HelperFunctions";
import { ContainerNodeImpl } from "../contrainer-node/ContainerNode";
import { DEVELOPING, EXPANDING, FINALIZING, FOUNDING } from "../../cluster/central-cluster/CentralClusterStage";
import { SubNodeMemoryTypes } from "../NodeUtils";
import { Reducer } from "../../utils/Reducer";
import { PioneerType } from "../../unit/pioneer/PioneerType";
import { pioneerBodyT1, pioneerBodyT2 } from "../../unit/pioneer/PioneerBody";
import { ClusterNodeMemoryType } from "./ClusterNodeType";

export class ClusterNodeImpl extends TopNodeBase implements ClusterNode {
    protected readonly _flag = undefined;
    protected readonly _structure: StructureController;

    protected constructor(name: string, cluster: Cluster, structure: StructureController) {
        super(name, cluster, structure);

        this._structure = structure;
    }

    protected reconstructSubNodes() {
        const recNodes: Array<SubNode> = Memory.get.all.nodes
            // filter only the memory of sub nodes
            .filter<SubNodeMemory>(checkType<SubNodeMemory>(...SubNodeMemoryTypes))
            // filter only the sub-nodes belongs to this node
            .filter(subNodeMemory => subNodeMemory.superNodeName === this.name)
            // build objects from the memory
            .map(subNodeMemory => {
                switch (subNodeMemory.type) {
                    // TODO add more type
                    case "ContainerNode":
                        return ContainerNodeImpl.build.from(subNodeMemory, this.cluster, this);
                    default:
                        throw Error(`Not a valid Sub Node type with ${subNodeMemory.name} ${subNodeMemory.type}`);
                }
            })

        this.subNodes.push(...recNodes);
    }

    protected reconstructUnits() {
        const recUnits: Array<Unit> = Memory.get.all.units
            .filter(unitMemory => unitMemory.nodeName === this.name)
            .map(unitMemory => {
                switch (unitMemory.type) {
                    // TODO: add more unit type
                    case "Pioneer":
                        return PioneerImpl.build.from(unitMemory, this.cluster, this);
                    default:
                        throw Error(`Not a valid Unit type with ${unitMemory.name} ${unitMemory.type}`);
                }
            })

        this.units.push(...recUnits);
    }

    run(clusterType: ClusterType, stage: ClusterStage): void {
        // reconstruct sub components
        this.reconstructSubNodes();
        this.reconstructUnits();


        // TODO add logic
        switch (clusterType) {
            case "CentralCluster":
                this.runInCentralCluster(stage);
                break;
        }

        // save to memory
        this.save();
    }

    /**
     * The process running in the CentralCluster
     * @param stage - The stage of the CentralCluster
     * @private
     */
    private runInCentralCluster(stage: CentralClusterStage) {
        // check the required units for spawning
        switch (stage) {
            case FOUNDING:
                const pioneerCapacity = this.cluster.sources // get all sources in this cluster
                    // summation all working slots of sources
                    .map(getByKey<number>("numberOfWorkingSlots"))
                    .reduce(Reducer.add);

                // get total number of pioneers
                const pioneers: Array<Pioneer> = this.units
                    .filter(checkType(PioneerType));

                const nPioneer: number = pioneers.map(() => 1)
                    .reduce(Reducer.add);

                // if the number of pioneer is less than target, need to spawn more
                if (nPioneer < pioneerCapacity) {
                    // find valid harvest slots
                    const occupiedSlots: Array<RoomPosition> = pioneers
                        .map(getByKey<RoomPosition>("sourceSlot"));

                    const neededBody = this.getPioneerBody();

                    this.cluster.sources.map((source): [SourceNode, Array<RoomPosition>] => [source, source.workingSlots])
                        .forEach(([source, sourceSlots]) => sourceSlots.forEach(slot => {
                            // if the slot is not in the occupied slots, meaning the slot is valid for new Pioneer unit.
                            if (!includeRoomPosition(occupiedSlots, slot)) {
                                // build new pioneer unit
                                const newPioneer = PioneerImpl.build.with(
                                    neededBody,
                                    this.cluster,
                                    this,
                                    this.cluster.controller.structure,
                                    source,
                                    slot);
                                // add to spawn queue
                                this.cluster.spawn(newPioneer);
                                // save to memory
                                newPioneer.save();
                            }
                        }))
                }

                break;
            case EXPANDING:
                break;
            case DEVELOPING:
                break;
            case FINALIZING:
                break;
        }

        this.units.forEach(unit => unit.run());
    }

    // this function returns the proper UnitBody of pioneer with current cluster level (room level) in FOUNDING stage.
    protected getPioneerBody(): UnitBody {
        switch (this.cluster.level) {
            case 1:
                return pioneerBodyT1;
            case 2:
                return pioneerBodyT2;
            default:
                throw Error("The level in FOUNDING stage should be 1 or 2.")
        }
    }

    static readonly build: NodeBuilder<ClusterNode> = {

        with(name: string, cluster: Cluster, structure: StructureController): ClusterNode {
            return new ClusterNodeImpl(name, cluster, structure);
        },

        from(memory: ClusterNodeMemory, cluster: Cluster): ClusterNode {
            return this.with(
                memory.name,
                cluster,
                Game.getObjectById(memory.structureId)
            )
        }
    };

    protected save(): void {
        Memory.set.node<ClusterNodeMemory>(this.name).as({
            name: this.name,
            type: this.type,
            clusterName: this.cluster.name,
            memoryType: ClusterNodeMemoryType,
            structureId: this.structure.id,
            others: {}
        })
    }

    hasFlag(): boolean {
        return false;
    }

    get type(): ClusterNodeType {
        return "ClusterNode";
    }

    get structure(): StructureController {
        return this._structure;
    }
}