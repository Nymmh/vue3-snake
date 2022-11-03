import { defineStore } from "pinia";

import { coordinates } from "../types/coordinates";

export const gameStore = defineStore("gameStore", {
  state: () => {
    return {
      snake: [] as coordinates[],
      snakeLastPos: [] as coordinates[],
      direction: "",
      food: {} as coordinates,
    };
  },
});
