<template>
  <div class="container">
    <h1 class="title">国名ルーレット</h1>
    <div class="content">
      <p>{{ roulette }}</p>
      <p>
        <img :src="roulette_img" />
      </p>
      <p>
        <button @click="start_roulette">start</button>
        <button @click="stop_roulette">stop</button>
        <button @click="clear_roulette">clear</button>
      </p>
      <p>{{ countries }}</p>
      <p>{{ countries_already }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      countries: [
        {'name': 'アイスランド', 'image': require('@/assets/100006432.gif')},
        {'name': 'アイルランド', 'image': require('@/assets/100047433.gif')},
        {'name': 'アゼルバイジャン共和国', 'image': require('@/assets/100047425.gif')},
        {'name': 'アフガニスタン・イスラム共和国', 'image': require('@/assets/000062981.jpg')},
      ],
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
    },
    clear_roulette() {
      if (this.timer !== null) {
        console.log('timer is active.')
        return
      }
      this.countries = this.countries.concat(this.countries_already)
      this.countries_already = []
      alert('終了!')
    }
  }
})
</script>
