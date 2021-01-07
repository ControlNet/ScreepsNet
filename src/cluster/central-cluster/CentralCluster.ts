import { ClusterBase } from "../Cluster";
import { DEVELOPING, EXPANDING, FINALIZING, FOUNDING } from "./CentralClusterStage";
import { ClusterNodeImpl } from "../../node/cluster-node/ClusterNode";
import { SpawnNodeImpl } from "../../node/spawn-node/SpawnNode";
import { checkType, getByKey } from "../../utils/Others";
import { SourceNodeImpl } from "../../node/source-node/SourceNode";
import { ControllerNodeImpl } from "../../node/controller-node/ControllerNode";
import { TopNodeImpls } from "../../node/NodeUtils";

export class CentralClusterImpl extends ClusterBase implements CentralCluster {
    constructor(name: string, home: Room, fromMemory: boolean = true) {
        super(name, home, fromMemory);
    }

    run(): void {
        // reconstruct nodes
        this.reconstructNodes();

        // scan non-marked top nodes
        this.scan();

        // run main loop
        this.topNodes.forEach(each => each.run(this.type, this.stage))

        // switch (this.stage) {
        //     case FOUNDING:
        //         this.runFounding()
        //         break;
        //     case EXPANDING:
        //         this.runExpanding()
        //         break;
        //     case DEVELOPING:
        //         this.runDeveloping()
        //         break;
        //     case FINALIZING:
        //         this.runFinalizing()
        //         break;
        // }
        // save to memory
        this.save();
    }

    protected reconstructNodes(): void {
        Memory.get.all.nodes // get all nodes memory from Memory.
            // only filter the nodes belongs to this cluster
            .filter(nodeMemory => nodeMemory.clusterName === this.name)
            .map(nodeMemory => {
                // reconstruct nodes from memory with specified types
                switch (nodeMemory.type) {
                    case "ClusterNode":
                        const clusterNode = ClusterNodeImpl.build.from(nodeMemory, this);
                        this.node = clusterNode;
                        return clusterNode;
                    case "SpawnNode":
                        const spawnNode = SpawnNodeImpl.build.from(nodeMemory, this);
                        this.spawns.push(spawnNode);
                        return spawnNode;
                    case "ControllerNode":
                        const controllerNode = ControllerNodeImpl.build.from(nodeMemory, this);
                        this.controller = controllerNode;
                        return controllerNode;
                    case "SourceNode":
                        const sourceNode = SourceNodeImpl.build.from(nodeMemory, this);
                        this.sources.push(sourceNode);
                        return sourceNode;
                    // TODO: Add other node types
                    default:
                        console.log("Error nodeMemory: " + nodeMemory);
                        throw Error("Parsing node memory type fail!");
                }
            })
            .forEach(this.add.node); // Assign the nodes to `this.node`.

        // filter directly managed nodes (top nodes)
        this.topNodes = _.values(this.nodes).filter<TopNode>(checkType<TopNode>(...TopNodeImpls));
    }

    /**
     * Scan unmarked RoomController, Source and Spawn.
     * @protected
     */
    protected scan(): void {
        // scan sources
        this.rooms
            // get all sources in the controlled room of this cluster
            .flatMap(room => room.find(FIND_SOURCES))
            // filter the un-labelled sources
            .filter(source => !(source.id in this.sources.map(sourceNode => sourceNode.name)))
            // for each source, construct a new SourceNode object,
            // add to the `this.nodes` and `this.sources`
            .forEach(source => {
                const sourceNode = SourceNodeImpl.build.with(source); // TODO: Not finished yet
                this.add.node(sourceNode);
                this.sources.push(sourceNode);
            })

        // scan controller
        if (this._controller === undefined) {
            // if no controller defined, build the ControllerNode and add to the `this.nodes` and `this.controller`
            const controllerNode = ControllerNodeImpl.build.with(this.home.controller); // TODO: Not finished yet
            this.add.node(controllerNode);
            this.controller = controllerNode;
        }

        // scan spawn
        this.rooms
            // get all my spawns in the controlled room of this cluster
            .flatMap(room => room.find(FIND_MY_SPAWNS))
            // filter the unlabelled spawns
            .filter(spawn => !(spawn.name in this.spawns.map(spawnNode => spawnNode.name)))
            // for each spawn, construct a new SpawnNode object,
            // add to the `this.nodes` and `this.spawns`
            .forEach(spawn => {
                const spawnNode = SpawnNodeImpl.build.with(spawn); // TODO: Not finished yet
                this.add.node(spawnNode);
                this.spawns.push(spawnNode);
            })
    }

    private runFounding(): void {
        //TODO
    }

    private runExpanding(): void {
        //TODO
    }

    private runDeveloping(): void {
        //TODO
    }

    private runFinalizing(): void {
        //TODO
    }

    get stage(): CentralClusterStage {
        if (this.level === 8) {
            return FINALIZING;
        } else if (this.level >= 6) {
            return DEVELOPING;
        } else if (this.level >= 3) {
            return EXPANDING;
        } else if (this.level >= 0) {
            return FOUNDING;
        } else {
            throw Error("No Controller in this Room " + this.home.name)
        }
    }

    get type(): string {
        return "CentralCluster";
    }

    static readonly build: Builder<CentralCluster> = {
        with(name: string, home: Room): CentralCluster {
            // build new CentralCluster object.
            return new CentralClusterImpl(name, home, false);
        },

        from(memory: ClusterMemory<CentralClusterMemoryComplement>): CentralCluster {
            // name and home
            const obj = new CentralClusterImpl(
                memory.name,
                Game.rooms[memory.homeRoomName],
                true
            );

            // rooms
            obj.rooms.push(...memory.roomsNames.map(roomName => Game.rooms[roomName]));
            // nodes will be added in the main loop process
            // construction sites
            obj.constructionSites.push(...memory.constructionSitesIds.map(id => Game.constructionSites[id]));
            return obj;
        }
    };

    protected save(): void {
        const getName: (obj: any) => string = getByKey("name");

        Memory.set.cluster<ClusterMemory<CentralClusterMemoryComplement>>(this.name).as({
            name: this.name,
            type: "CentralCluster",
            homeRoomName: this.home.name,
            roomsNames: this.rooms.map(getName),
            nodesNames: _.keys(this.nodes),
            nodeName: this.node.name,
            constructionSitesIds: this.constructionSites.map(getByKey("id")),
            others: {}
        });
    }
}