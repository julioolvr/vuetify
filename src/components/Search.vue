<template>
  <div>
    <input type="text" v-model="query" @keyup.enter="search">
    <button @click="search">Search</button>
    <a href="#" @click.prevent="reset">Reset</a>

    <div><small>{{ found }}</small></div>

    <ul v-show="results.length > 0 && !isLoading">
      <li v-for="result in results">
        <a :href="result.external_urls.spotify">{{ result.name }}</a>
      </li>
    </ul>

    <div v-show="results.length === 0 && !isLoading">No results found</div>
    <div v-show="isLoading">Loading...</div>
  </div>
</template>

<script>
  import spotify from '../services/spotify'

  const INITIAL_STATE = {
    query: '',
    results: [],
    isLoading: false,
  };

  export default {
    name: 'Search',

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
    }
  }
</script>

<style scoped>
  li a {
    text-decoration: none;
  }

  li a:hover {
    text-decoration: underline;
  }
</style>