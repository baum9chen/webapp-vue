<template>
  <div class="container">
    <h3 class="title">国名ルーレット</h3>
    <div class="content">
      <p>
        <button class="roulette-btn" @click="start_roulette">Start</button>
        <button class="roulette-btn" @click="stop_roulette">Stop</button>
        <button class="roulette-btn" @click="clear_roulette">Clear</button>
      </p>
      <p class="content-country">{{ roulette }}</p>
      <p class="content-countryflag">
        <img :src="roulette_img" />
      </p>
      <hr />
      <p>すでに出た国↓↓↓（あと {{ countries.length }} か国）</p>
      <p class="coutries_already">
        <ul>
          <li v-for="item in countries_already" :key="item.name">{{ item.name }}</li>
        </ul>
      </p>
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
        'name': json_data[i]['text'],
        'image': json_data[i]['img'] != '' ? require('@/assets/' + json_data[i]['img'].split('/').slice(-1)[0]) : ''
      })
    }

    return {
      countries: countries,
      countries_already: []　as { name: string; image: any }[],
      roulette: '',
      roulette_img: '',
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
        this.roulette_img = this.countries[idx]['image']
      }, 100)
    },
    stop_roulette() {
      if (this.timer === null) {
        console.log('timer is not active')
        return 
      }
      window.clearInterval(this.timer)
      this.timer = null

      //現在表示中の国を探す
      let e = this.countries.find((e) => e['name'] == this.roulette)
      if (e) {
        //countries_alreadyに追加
        this.countries_already.push(e)

        //countriesから除去
        let arr = this.countries.filter((e) => e['name'] != this.roulette)
        this.countries = arr
      }
      if (this.countries.length == 0) {
        alert('終了!')
      }
    },
    clear_roulette() {
      if (this.timer !== null) {
        console.log('timer is active.')
        return
      }
      if (confirm('はじめからやり直します。いいですか？')) {
        if (confirm('ほんとにいいの？')) {
          this.countries = this.countries.concat(this.countries_already)
          this.countries_already = []
        }
      }
    }
  }
})
</script>

<style scoped>
div.content {
  font-family: sans-serif;
}
button.roulette-btn {
  width:85px;
  height: 50px;
  border-radius: 45%;
  font-size: 1.25em;
  margin: 0px 10px;
}
p.content-country {
  font-weight: bold;
  font-size: 1.25em;
}
</style>
