import { traveler } from "utils/Traveler";
import { ErrorMapper } from "utils/ErrorMapper";
import { CentralClusterImpl } from "../cluster/central-cluster/CentralCluster";
import { extensionInit } from "../extensions/ExtensionInit";
import { MemoryIO } from "../extensions/memory/MemoryIO";
import _ from "lodash";

// Network object
export const network: Network = {
    clusters: [],

    /**
     * Initialize the AI.
     */
    init(): void {
        traveler.init();
        extensionInit();
    },
    /**
     * Automatically clean the non-existed creeps.
     */
    clean(): void {
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                delete Memory.creeps[name];
                delete Memory.units[name];
            }
        }
    },

    reconstructClusters(): void {
        this.clusters = MemoryIO.get.all.clusters.map(clusterMemory => {
            switch (clusterMemory.type) {
                case "CentralCluster":
                    return CentralClusterImpl.build.from(clusterMemory);
                default:
                    console.log(clusterMemory);
                    throw Error("Not valid cluster type.");
            }
        });
    },

    /**
     * Main loop.
     */
    run(): () => void {
        return ErrorMapper.wrapLoop(() => {
            // reset memory roots
            if (Memory.clusters === undefined) {
                Memory.clusters = {};
            }
            if (Memory.nodes === undefined) {
                Memory.nodes = {};
            }
            if (Memory.units === undefined) {
                Memory.units = {};
            }

            this.clean();
            // reconstruct Cluster objects from memory
            this.reconstructClusters();
            // build first cluster
            if (this.clusters.length === 0) {
                this.clusters.push(CentralClusterImpl.build.with(_.values(Game.rooms)[0]))
            }

            this.clusters.forEach(cluster => cluster.run());

        });
    }
}
