import { TopNodeBase } from "../Node";
import { PioneerImpl } from "../../unit/pioneer/Pioneer";
import { checkType } from "../../utils/Others";
import { ContainerNodeImpl } from "../contrainer-node/ContainerNode";
import { DEVELOPING, EXPANDING, FINALIZING, FOUNDING } from "../../cluster/central-cluster/CentralClusterStage";
import { SubNodeImpls } from "../NodeUtils";

export class ClusterNodeImpl extends TopNodeBase implements ClusterNode {
    protected readonly _flag = undefined;
    protected readonly _structure: StructureController;

    constructor(name: string, cluster: Cluster, structure: StructureController) {
        super(name, cluster, structure);

        this._structure = structure;
    }

    protected reconstructSubNodes() {
        const recNodes: Array<SubNode> = Memory.get.all.nodes
            // filter only the memory of sub nodes
            .filter<SubNodeMemory>(checkType<SubNodeMemory>(...SubNodeImpls))
            // filter only the sub-nodes belongs to this node
            .filter(subNodeMemory => subNodeMemory.superNodeName === this.name)
            // build objects from the memory
            .map(subNodeMemory => {
                switch(subNodeMemory.type) {
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
                this.runInClusterNode(stage);
                break;
        }

        // save to memory
        this.save();
    }

    private runInClusterNode(stage: CentralClusterStage) {
        switch (stage) {
            case FOUNDING:


                break;
            case EXPANDING:
                break;
            case DEVELOPING:
                break;
            case FINALIZING:
                break;
        }
    }

    static readonly build: Builder<ClusterNode> = {
        //TODO
        from(memory: NodeMemory<ClusterNodeMemoryComplement>, cluster: Cluster): ClusterNode {
            return undefined;
        },

        with(args: any): ClusterNode {
            return undefined;
        }

    };

    protected save(): void {
        //TODO
    }

    hasFlag(): boolean {
        return false;
    }


}