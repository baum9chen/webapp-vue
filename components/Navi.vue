<template>
  <nav>
    <nuxt-link to="/">TOP</nuxt-link>
    <nuxt-link to="/country">国名ルーレット</nuxt-link>
    <nuxt-link to="/capital">首都名ルーレット</nuxt-link>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  align-items: center;
  background: #222222;
}
nav a {
  display: block;
  padding: 0.5em;
  color: #eeeeee;
  line-height: 1em;
  text-decoration: none;
}

.nuxt-link-exact-active {
  background: #64c9a2;
}
</style>
