<script setup lang="ts">
import { PropType, toRefs } from "vue";
import { storeToRefs } from "pinia";

import { gameStore } from "../store/gameStore";

const props = defineProps({
  grid: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
});

const { grid } = toRefs(props);

let storeGame = gameStore();
let storeGameRefs = storeToRefs(storeGame);

console.log(storeGameRefs);
</script>

<template>
  <div class="grid">
    <div class="grid__row" v-for="(row, idx) in grid" :key="idx">
      <div v-for="(column, columnIdx) in grid" :key="columnIdx">
        <div :class="['grid__cell', `grid__cell--${idx}--${columnIdx}`]">
          <div
            :class="[
              'grid__snake',
              { 'grid__snake--show': snake.y === idx && snake.x === columnIdx },
            ]"
            v-for="(snake, snakeIdx) in storeGameRefs.snake.value"
            :key="snakeIdx"
          >
            <template v-if="snake.y === idx && snake.x === columnIdx">
              <div
                :class="[
                  'grid__snake--draw',
                  { 'grid__snake--draw-head': snakeIdx === 0 },
                ]"
                :id="`snake-part--${snake.y}--${snake.x}`"
              />
            </template>
          </div>
          <div
            class="grid__food"
            v-if="
              storeGameRefs.food.value.y === idx &&
              storeGameRefs.food.value.x === columnIdx
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.grid {
  &__row {
    border-left: 1px solid #fff;
    border-right: 1px solid #fff;
    display: flex;
    flex-flow: row;
  }

  &__cell {
    border: 1px solid #fff;
    height: 20px;
    position: relative;
    width: 20px;
  }

  &__snake {
    display: none;
    height: 100%;
    position: relative;
    width: 100%;

    &--show {
      display: block;
    }

    &--draw {
      background-color: green;
      height: 50%;
      position: absolute;
      right: 50%;
      top: 50%;
      transform: translate(50%, -50%);
      width: 50%;
    }

    &--draw-head {
      background-color: yellow;
    }
  }

  &__food {
    background-color: red;
    height: 50%;
    position: absolute;
    right: 50%;
    top: 50%;
    transform: translate(50%, -50%);
    width: 50%;
  }
}
</style>
