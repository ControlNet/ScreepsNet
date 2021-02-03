import { network } from "network/Network";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code

// initialize the network
network.init();

// main loop
export const loop = network.run();

