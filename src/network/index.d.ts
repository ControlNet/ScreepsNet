interface Network {
    cluster: Array<Cluster>;

    /**
     * Initialize the AI.
     */
    init(): void;

    /**
     * Clean the memory in the loop.
     */
    clean(): void;

    /**
     * Reconstruct clusters from memory.
     */
    reconstructClusters(): void;

    /**
     * Run main loop in the game.
     */
    run(): void;
}
