import { MemorySetterHandlerImpl } from "./MemorySetterHandler";

export function initMemoryExt() {
    Memory.get = {
        creep(name: string): CreepMemory {
            return Memory.creeps[name];
        },

        flag(name: string): FlagMemory {
            return Memory.flags[name];
        },

        powerCreep(name: string): PowerCreepMemory {
            return Memory.powerCreeps[name];
        },

        room(name: string): RoomMemory {
            return Memory.rooms[name];
        },

        spawn(name: string): SpawnMemory {
            return Memory.spawns[name];
        },

        cluster<T extends MemoryComplement>(name: string): ClusterMemory<T> {
            return <ClusterMemory<T>>Memory.clusters[name];
        },

        node<T extends MemoryComplement>(name: string): NodeMemory<T> {
            return <NodeMemory<T>>Memory.nodes[name];
        },

        unit<T extends MemoryComplement>(name: string): UnitMemory<T> {
            return <UnitMemory<T>>Memory.units[name];
        },

        all: {
            get creeps(): Array<CreepMemory> {
                return Object.values(Memory.creeps);
            },

            get powerCreeps(): Array<PowerCreepMemory> {
                return Object.values(Memory.powerCreeps);
            },

            get flags(): Array<FlagMemory> {
                return Object.values(Memory.flags);
            },
            get rooms(): Array<RoomMemory> {
                return Object.values(Memory.rooms);
            },
            get spawns(): Array<SpawnMemory> {
                return Object.values(Memory.spawns);
            },
            get clusters(): Array<ClusterMemory> {
                return Object.values(Memory.clusters);
            },
            get nodes(): Array<NodeMemory> {
                return Object.values(Memory.nodes);
            },
            get units(): Array<UnitMemory> {
                return Object.values(Memory.units);
            }
        }
    };

    Memory.set = {
        creep<T extends CreepMemory = CreepMemory>(name: string): MemorySetterHandler<T> {
            return new MemorySetterHandlerImpl<T>(name, "creeps");
        },

        powerCreep<T extends PowerCreepMemory = PowerCreepMemory>(name: string): MemorySetterHandler<T> {
            return new MemorySetterHandlerImpl<T>(name, "powerCreeps");
        },

        flag<T extends FlagMemory = FlagMemory>(name: string): MemorySetterHandler<T> {
            return new MemorySetterHandlerImpl<T>(name, "flags");
        },

        room<T extends RoomMemory = RoomMemory>(name: string): MemorySetterHandler<T> {
            return new MemorySetterHandlerImpl<T>(name, "rooms");
        },

        spawn<T extends SpawnMemory = SpawnMemory>(name: string): MemorySetterHandler<T> {
            return new MemorySetterHandlerImpl<T>(name, "spawns");
        },

        cluster<T extends ClusterMemory = ClusterMemory>(name: string): MemorySetterHandler<T> {
            return new MemorySetterHandlerImpl<T>(name, "clusters");
        },

        node<T extends NodeMemory = NodeMemory>(name: string): MemorySetterHandler<T> {
            return new MemorySetterHandlerImpl<T>(name, "nodes");
        },

        unit<T extends UnitMemory = UnitMemory>(name: string): MemorySetterHandler<T> {
            return new MemorySetterHandlerImpl<T>(name, "units");
        }

    }
}

