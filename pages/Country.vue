<template>
  <div class="container">
    <h1>国名ルーレット</h1>
    <div class="content">
      <p>
        <button class="roulette-btn roulette-button-start" @click="start_roulette">Start</button>
        <button class="roulette-btn roulette-button-stop" @click="stop_roulette">Stop</button>
        <button class="roulette-btn-clear" @click="clear_roulette">Clear</button>
      </p>
      <p class="content-country">{{ roulette }}</p>
      <div class="content-countryflag-wrapper">
        <div class="content-countryflag-overlay"
          :style="{ opacity: overlayOpacity }"
          @mousedown="show_hint" @touchstart="show_hint"
          @mouseup="close_hint" @touchend="close_hint">ヒントはここをタップ</div>
        <img class="content-countryflag-img" :src="roulette_img" />
      </div>
    </div>
    <hr />
    <div class="content">
      <p>すでに出た国↓↓↓（あと {{ countries.length }} か国）</p>
      <p class="content-countries_already">
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
      roulette: 'なにがでるかな',
      roulette_img: require('@/assets/no_image.gif'),
      timer: null as number | null,
      overlayOpacity: 1,
      fadingTimer: null as number | null
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
    },
    show_hint() {
      this.fadingTimer = setInterval(() => {
        if (this.overlayOpacity > 0) {
          this.overlayOpacity -= 0.05
        } else {
          if (this.fadingTimer !== null) {
            clearInterval(this.fadingTimer)
            this.fadingTimer = null
          }
        }
      }, 50)
    },
    close_hint() {
      if (this.fadingTimer !== null) {
        clearInterval(this.fadingTimer)
        this.fadingTimer = null
      }
      this.overlayOpacity = 1
    }
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
button.roulette-btn-clear {
  width: 120px;
  height: 75px;
  border-radius: 45%;
  font-size: 1.6em;
  margin: 0px 10px;
  vertical-align: top;
}
p.content-country {
  font-weight: bold;
  font-size: 7em;
  margin: 50px 0px;
}
p.content-countries_already ul li {
  font-size: 0.75em;
}
div.content-countryflag {
  /* 画像の最大値が100px */
  height: 100px;
}
div.content-countryflag-wrapper {
  position: relative;
  height: 100px;
  width: 200px;
}
div.content-countryflag-overlay { 
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 98px;
  z-index: 1;
  color: #ffffff;
  background-color: #999999;
  border: 1px solid #000000;
  pointer-event: none;
  text-align: center;
  vertical-align: middle;
}

</style>
