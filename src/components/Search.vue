<template>
  <div>
    <input type="text" v-model="query" @keyup.enter="search">
    <button @click="search">Search</button>
    <a href="#" @click.prevent="reset">Reset</a>

    <div><small>{{ found }}</small></div>

    <ul class="artists" v-show="results.length > 0 && !isLoading">
      <artist v-for="result in results" :artist="result" :key="result.id" />
    </ul>

    <div v-show="results.length === 0 && !isLoading">No results found</div>
    <div v-show="isLoading">Loading...</div>
  </div>
</template>

<script>
  import Artist from './Artist.vue'
  import spotify from '../services/spotify'

  const INITIAL_STATE = {
    query: '',
    results: [],
    isLoading: false,
  };

  export default {
    name: 'Search',
    components: { Artist },

    data() {
      return Object.assign({}, INITIAL_STATE)
    },

    computed: {
      found() {
        const itemsCount = this.results.length;

        if (itemsCount > 0) {
          return `${itemsCount} items found`
        } else {
          return ''
        }
      }
    },

    watch: {
      query(newVal, oldVal) {
        console.log('changed query from', oldVal, 'to', newVal)
      }
    },

    methods: {
      search() {
        this.isLoading = true

        spotify.search(this.query, 'artist')
          .then(res => {
            this.isLoading = false
            this.results = res.artists.items
          })
      },
      reset() {
        Object.assign(this, INITIAL_STATE)
      }
    },

    // Lifecycle
    created() {
      this.query = location.pathname.match(/^\/(.*)/)[1]

      if (this.query) {
        this.search()
      }
    }
  }
</script>

<style scoped>
  .artists {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>