<template>
  <div id="app">
    <main class="page-content" aria-label="Content">
        <router-view></router-view>
      </section>
    </main>
  </div>
</template>

<script>
require('vue2-animate/dist/vue2-animate.min.css')
import {YMCAMixin} from '@/components/mixins/Ymca'
export default {
  name: 'app',
  mixins: [YMCAMixin]
}
</script>

<style>
</style>
