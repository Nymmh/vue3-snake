<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, stop } from "vue";
import { storeToRefs } from "pinia";

import { gameStore } from "./store/gameStore";

import { coordinates } from "./types/coordinates";

import { randomNumber } from "./helpers/randomNumber";

import Grid from "./components/Grid.vue";

const isPlaying = ref<boolean>(false);
const interval = ref();
const grid = ref<Array<number>>([]);
const TICK_RATE = 100;
const GRID_SIZE = 35;
const snakeHitWall = ref<boolean>(false);

const acceptedKeyCodes = ["KeyW", "KeyA", "KeyS", "KeyD"];

let storeGame = gameStore();
let storeGameRefs = storeToRefs(storeGame);

const generateGrid = () => {
  grid.value = [];
  grid.value = new Array(GRID_SIZE).fill(0);
};

const generateFood = () => {
  let food = {
    y: randomNumber(1, GRID_SIZE - 1),
    x: randomNumber(1, GRID_SIZE - 1),
  };

  storeGame.$patch({
    food: food,
  });
};

const generateSnake = () => {
  let snake = [];

  snake.push({
    y: randomNumber(1, GRID_SIZE - 1),
    x: randomNumber(1, GRID_SIZE - 1),
  });

  storeGame.$patch({
    snake: snake,
    direction: "",
  });
};

const collision = () => {
  stopGame();
};

const foodCheck = (x: number, y: number) => {
  if (x === storeGameRefs.food.value.x && y === storeGameRefs.food.value.y) {
    eatFood();
  }
};

const bodyCollisionCheck = (x: number, y: number) => {
  for (let sn of storeGameRefs.snake.value) {
    if (sn.x === x && sn.y === y) {
      stopGame();
    }
  }
};

const eatFood = () => {
  addToSnake();
  generateFood();
};

const addToSnake = () => {
  let snake = storeGameRefs.snake.value;

  if (storeGameRefs.snake.value.length === 1) {
    snake.push({
      x: snake[0].x,
      y: snake[0].y,
    });
  } else {
    let tail = storeGameRefs.snake.value.slice(1);
    snake.push({
      x: tail[0].x,
      y: tail[0].y,
    });
  }

  storeGame.$patch({
    snake: snake,
  });

  console.log(storeGameRefs.snake.value, "up");
};

const changeDirection = (e: KeyboardEvent) => {
  if (
    !acceptedKeyCodes.includes(e.code) ||
    storeGameRefs.direction.value === e.code
  )
    return;

  storeGame.$patch({
    direction: e.code,
  });
};

const moveBody = (index: number, snake: coordinates) => {
  let partX = storeGameRefs.snake.value[index - 1].x;
  let partY = storeGameRefs.snake.value[index - 1].y;

  return {
    x: partX,
    y: partY,
  };
};

const onTick = () => {
  if (snakeHitWall.value) {
    stopGame();
    return;
  }

  let newSnakeCords: coordinates[] = [];

  storeGame.$patch({
    snakeLastPos: storeGameRefs.snake.value,
  });

  if (!storeGameRefs.direction.value) return;

  if (storeGameRefs.direction.value === "KeyW") {
    for (let [idx, sn] of storeGameRefs.snake.value.entries()) {
      if (idx === 0) {
        foodCheck(sn.x, sn.y - 1);

        newSnakeCords.push({
          x: sn.x,
          y: sn.y - 1,
        });
      } else {
        let parts = moveBody(idx, sn);

        newSnakeCords.push({
          x: parts.x,
          y: parts.y,
        });
      }

      if (idx === 0 && sn.y - 1 < 0) {
        collision();
      }
    }
  } else if (storeGameRefs.direction.value === "KeyA") {
    for (let [idx, sn] of storeGameRefs.snake.value.entries()) {
      if (idx === 0) {
        foodCheck(sn.x - 1, sn.y);
        bodyCollisionCheck(sn.x - 1, sn.y);

        newSnakeCords.push({
          x: sn.x - 1,
          y: sn.y,
        });
      } else {
        let parts = moveBody(idx, sn);

        newSnakeCords.push({
          x: parts.x,
          y: parts.y,
        });
      }

      if (idx === 0 && sn.x - 1 < 0) {
        collision();
      }
    }
  } else if (storeGameRefs.direction.value === "KeyS") {
    for (let [idx, sn] of storeGameRefs.snake.value.entries()) {
      if (idx === 0) {
        foodCheck(sn.x, sn.y + 1);

        newSnakeCords.push({
          x: sn.x,
          y: sn.y + 1,
        });
      } else {
        let parts = moveBody(idx, sn);

        newSnakeCords.push({
          x: parts.x,
          y: parts.y,
        });
      }

      if (idx === 0 && sn.y + 1 >= GRID_SIZE) {
        collision();
      }
    }
  } else if (storeGameRefs.direction.value === "KeyD") {
    for (let [idx, sn] of storeGameRefs.snake.value.entries()) {
      if (idx === 0) {
        foodCheck(sn.x + 1, sn.y);

        newSnakeCords.push({
          x: sn.x + 1,
          y: sn.y,
        });
      } else {
        let parts = moveBody(idx, sn);

        newSnakeCords.push({
          x: parts.x,
          y: parts.y,
        });
      }

      if (idx === 0 && sn.x + 1 >= GRID_SIZE) {
        collision();
      }
    }
  }

  storeGame.$patch({
    snake: newSnakeCords,
  });
};

const startGame = () => {
  generateGrid();
  generateFood();
  generateSnake();

  if (window) {
    window.addEventListener("keyup", changeDirection);
  }

  isPlaying.value = !isPlaying.value;

  interval.value = setInterval(() => {
    onTick();
  }, TICK_RATE);
};

const stopGame = () => {
  isPlaying.value = false;
  clearInterval(interval.value);
};

onBeforeUnmount(() => {
  if (window) {
    window.removeEventListener("keyup", changeDirection);
  }

  clearInterval(interval.value);
});
</script>

<template>
  <div class="buttons" v-if="!isPlaying">
    <button @click="startGame">Start Game</button>
  </div>
  <div class="snake" v-if="isPlaying">
    <Grid :grid="grid" />
  </div>
</template>
