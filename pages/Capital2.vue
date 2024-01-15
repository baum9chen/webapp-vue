<template>
  <div class="container">
    <h1>首都名ルーレット（かぶりあり版）</h1>
    <div class="content">
      <p>
        <button class="roulette-btn roulette-button-start" @click="start_roulette">Start</button>
        <button class="roulette-btn roulette-button-stop" @click="stop_roulette">Stop</button>
      </p>
      <p class="content-country">{{ roulette }}</p>
      <p class="content-country-hint">ヒント：<span class="content-country-hint-text">{{ roulette_hint }}</span></p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    const json_data = require('~/static/info.json')
    var countries = []
    for (var i = 0; i < json_data.length; ++i) {
      countries.push({
        'name': json_data[i]['properties']['capital'],
        'hint': json_data[i]['text']
      })
    }

    return {
      countries: countries,
      roulette: 'なにがでるかな',
      roulette_hint: 'なにがでるかな',
      timer: null as number | null,
    }
  },
  methods: {
    start_roulette() {
      if (this.timer !== null) {
        console.log('roulette is active.')
        return
      }
      if (this.countries.length === 0) {
        console.log('no countries')
        return
      }
      this.timer = window.setInterval(() => {
        let idx = Math.floor(Math.random() * this.countries.length)
        // this.countries.length - 1 にすると最後の要素が出なくなる
        // this.countries.lengthだと最大値が配列のindexから溢れるはずなので保険として
        if (idx == this.countries.length) {
          idx -= 1
        }
        this.roulette = this.countries[idx]['name']
        this.roulette_hint = this.countries[idx]['hint']
      }, 100)
    },
    stop_roulette() {
      if (this.timer === null) {
        console.log('timer is not active')
        return 
      }
      window.clearInterval(this.timer)
      this.timer = null
    },
  }
})
</script>

<style scoped>
div.content {
  font-family: sans-serif;
}
h1 {
  font-size: 2em;
}
button.roulette-btn {
  width: 240px;
  height: 150px;
  border-radius: 45%;
  font-size: 3.5em;
  margin: 0px 10px;
}
p.content-country {
  font-weight: bold;
  font-size: 7em;
  margin: 50px 0px;
}
p.content-country-hint span.content-country-hint-text {
  font-size: 0.5em;
  color: #aaaaaa;
}

</style>
