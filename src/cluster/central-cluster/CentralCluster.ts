import { ClusterBase } from "../Cluster";
import { DEVELOPING, EXPANDING, FINALIZING, FOUNDING } from "./CentralClusterStage";
import { ClusterNodeImpl } from "../../node/cluster-node/ClusterNode";
import { SpawnNodeImpl } from "../../node/spawn-node/SpawnNode";
import { checkType, getByKey } from "../../utils/HelperFunctions";
import { SourceNodeImpl } from "../../node/source-node/SourceNode";
import { ControllerNodeImpl } from "../../node/controller-node/ControllerNode";
import _ from "lodash";
import { CentralClusterMemoryType, CentralClusterType } from "./CentralClusterType";
import { TopNodeTypes } from "../../node/NodeUtils";
import { MemoryIO } from "../../extensions/memory/MemoryIO";
import { ClusterNodeType } from "../../node/cluster-node/ClusterNodeType";
import { SpawnNodeType } from "../../node/spawn-node/SpawnNodeType";
import { ControllerNodeType } from "../../node/controller-node/ControllerNodeType";
import { SourceNodeType } from "../../node/source-node/SourceNodeType";

export class CentralClusterImpl extends ClusterBase implements CentralCluster {

    run(): void {
        // reconstruct nodes
        this.reconstructNodes();

        // scan non-marked top nodes
        this.scan();

        // run main loop
        this.topNodes.forEach(node => node.run(this.type, this.stage))

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
        MemoryIO.get.all.nodes // get all nodes memory from Memory.
            // only filter the nodes belongs to this cluster
            .filter(nodeMemory => nodeMemory.clusterName === this.name)
            .map(nodeMemory => {
                // reconstruct nodes from memory with specified types
                switch (nodeMemory.type) {
                    case ClusterNodeType:
                        const clusterNode = ClusterNodeImpl.build.from(nodeMemory, this);
                        this.node = clusterNode;
                        return clusterNode;
                    case SpawnNodeType:
                        const spawnNode = SpawnNodeImpl.build.from(nodeMemory, this);
                        this.spawns.push(spawnNode);
                        return spawnNode;
                    case ControllerNodeType:
                        const controllerNode = ControllerNodeImpl.build.from(nodeMemory, this);
                        this.controller = controllerNode;
                        return controllerNode;
                    case SourceNodeType:
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
        this.topNodes = _.values(this.nodes).filter<TopNode>(checkType<TopNode>(...TopNodeTypes));
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
            .filter(source => !this.sources.map(sourceNode => sourceNode.structure.id).includes(source.id))
            // for each source, construct a new SourceNode object,
            // add to the `this.nodes` and `this.sources`
            .forEach(source => {
                const sourceNode = SourceNodeImpl.build.with(this, source);
                this.add.node(sourceNode);
                this.sources.push(sourceNode);
                this.topNodes.push(sourceNode);
            })

        // scan controller
        if (this._controller === undefined) {
            // if no controller defined, build the ControllerNode and add to the `this.nodes` and `this.controller`
            const controllerNode = ControllerNodeImpl.build.with(this, this.home.controller);
            this.add.node(controllerNode);
            this.controller = controllerNode;
            this.topNodes.push(controllerNode);
        }

        // scan spawn
        this.rooms
            // get all my spawns in the controlled room of this cluster
            .flatMap(room => room.find(FIND_MY_SPAWNS))
            // filter the unlabelled spawns
            .filter(spawn => !this.spawns.map(spawnNode => spawnNode.structure.name).includes(spawn.name))
            // for each spawn, construct a new SpawnNode object,
            // add to the `this.nodes` and `this.spawns`
            .forEach(spawn => {
                const spawnNode = SpawnNodeImpl.build.with(this, spawn);
                this.add.node(spawnNode);
                this.spawns.push(spawnNode);
                this.topNodes.push(spawnNode);
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

    spawn(unit: Unit): void {
        _.minBy(this.spawns, spawnNode => spawnNode.queueLength())!.spawn(unit)
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

    get type(): CentralClusterType {
        return CentralClusterType;
    }

    static readonly build: Builder<CentralCluster> = {
        with(home: Room): CentralCluster {
            const name = `${CentralClusterType}::${home.name}`;
            const rooms = [home];

            // build new CentralCluster object.
            const obj = new CentralClusterImpl(name, home, {}, rooms, [], [], [],
                []);

            obj.controller = ControllerNodeImpl.build.with(obj, obj.home.controller!);
            obj.node = ClusterNodeImpl.build.with(obj, obj.controller.structure);
            obj.nodes[obj.node.name] = obj.node;
            obj.topNodes.push(obj.node);

            return obj;
        },

        from(memory: ClusterMemory<CentralClusterMemoryComplement>): CentralCluster {
            // name and home
            return new CentralClusterImpl(
                memory.name,
                Game.rooms[memory.homeRoomName],
                {},
                memory.roomsNames.map(roomName => Game.rooms[roomName]),
                memory.constructionSitesIds.map(id => Game.getObjectById(id)!),
                [],
                [],
                []
            );
        }
    };

    protected save(): void {
        const getName: (obj: any) => string = getByKey("name");

        MemoryIO.set.cluster<ClusterMemory<CentralClusterMemoryComplement>>(this.name).as({
            name: this.name,
            type: this.type,
            memoryType: CentralClusterMemoryType,
            homeRoomName: this.home.name,
            roomsNames: this.rooms.map(getName),
            nodesNames: _.keys(this.nodes),
            nodeName: this.node.name,
            controllerName: this.controller.name,
            constructionSitesIds: this.constructionSites.map(getByKey("id")),
            others: {}
        });
    }
}