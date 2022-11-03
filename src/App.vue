<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const isPlaying = ref<boolean>(false);
const interval = ref();
const TICK_RATE = 100;

const changeDirection = () => {};

const onTick = () => {};

const startGame = () => {
  isPlaying.value = !isPlaying.value;

  interval.value = setInterval(() => {
    onTick();
  }, TICK_RATE);
};

const stopGame = () => {
  isPlaying.value = false;
  clearInterval(interval.value);
};

onMounted(() => {
  if (window) {
    window.addEventListener("keyup", changeDirection);
  }
});

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
  <div class="snake"></div>
</template>
