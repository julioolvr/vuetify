const spotifyService = {
  // Esta es la url base de la API
  baseUrl: 'https://api.spotify.com/v1',

  search(query, type) {
    const url = `${this.baseUrl}/search?q=${query}&type=${type}`
    return fetch(url, { method: 'GET' })
      .then(res => {
        // En el caso de que hay un error disparamos una excepción
        // para luego manejarla en nuestro componente
        if (res.status !== 200) {
          throw res.statusText
        }

        // Casteamos la respuesta y la devolvemos para
        // usarla luego en el componente
        return res.json()
      })
  }
}

export default spotifyService