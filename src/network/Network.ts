import { TravelerIniter } from "utils/Traveler";
import { ErrorMapper } from "utils/ErrorMapper";
import { initMemoryExt } from "../memory/MemoryExt";
import { CentralClusterImpl } from "../cluster/central-cluster/CentralCluster";

// Network object
export const network: Network = {
    cluster: [],

    /**
     * Initialize the AI.
     */
    init(): void {
        TravelerIniter.init();
        initMemoryExt();
    },
    /**
     * Automatically clean the non-existed creeps.
     */
    clean(): void {
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                delete Memory.creeps[name];
            }
        }
    },

    reconstructClusters(): void {
        Memory.get.all.clusters.map(clusterMemory => {
            switch (clusterMemory.type) {
                case "CentralCluster":
                    return CentralClusterImpl.build.from(clusterMemory);
                default:
                    console.log(clusterMemory);
                    throw Error("Not valid cluster type.");
            }
        }).forEach(each => this.cluster.push(each));
    },

    /**
     * Main loop.
     */
    run(): () => void {
        return ErrorMapper.wrapLoop(() => {
            this.clean();
            // reconstruct objects from memory
            this.reconstructClusters();

            // main loop
            const harvesters = Object.entries(Game.creeps)
                .filter(([name, creep]) => creep.memory.role == "harvester");

            if (harvesters.length < 2) {
                const newName = "Harvester" + Game.time;
                console.log("Spawning new harvester: " + newName);
                Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
                    memory: {
                        role: "harvester", upgrading: false, dest: null
                    }
                });
            }

            const upgraders = Object.entries(Game.creeps)
                .filter(([name, creep]) => creep.memory.role == "upgrader");

            if (upgraders.length < 2) {
                const newName = "Upgrader" + Game.time;

                const result = Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName,
                    {memory: {role: "upgrader", upgrading: false, dest: undefined}});

                if (result == 0) {
                    console.log("Spawning new upgrader: " + newName);
                }
            }

            if (Game.spawns["Spawn1"].spawning) {
                const spawningCreep = Game.creeps[Game.spawns["Spawn1"].spawning.name];
                Game.spawns["Spawn1"].room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    Game.spawns['Spawn1'].pos.x + 1,
                    Game.spawns['Spawn1'].pos.y,
                    {align: 'left', opacity: 0.8});
            }

            for (const name in Game.creeps) {
                const creep: Creep = Game.creeps[name];

                switch (creep.memory.role) {
                    case "harvester":
                        roleHarvester.run(creep);
                        break;
                    case "upgrader":
                        roleUpgrader.run(creep);
                        break;
                }
            }

        });
    }
}
