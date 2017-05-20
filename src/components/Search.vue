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

    <toaster v-show="showToaster" :message="toasterMessage" @close="toggleToaster" />
  </div>
</template>

<script>
  import Artist from './Artist.vue'
  import Toaster from './Toaster.vue'
  import spotify from '../services/spotify'

  const INITIAL_STATE = {
    query: '',
    results: [],
    isLoading: false,
    showToaster: false,
    toasterMessage: ''
  };

  export default {
    name: 'Search',
    components: { Artist, Toaster },

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
        this.results = []

        spotify.search(this.query, 'artist')
          .then(res => {
            this.results = res.artists.items
          })
          .catch(err => {
            this.toggleToaster()
            this.toasterMessage = err
          })
          .then(() => this.isLoading = false)
      },
      reset() {
        Object.assign(this, INITIAL_STATE)
      },
      toggleToaster() {
        this.showToaster = !this.showToaster
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