window.onload = () => {
    getOriginals()
    getTrendingNow()
    getTopRated()
  }
  


  // ** Helper function that makes dynamic API calls **
  async function fetchMovies(url, dom_element, path_type) {
    // Use Fetch with the url passed down 
    try {
      const response = await fetch(url);
      const data = await response.json();
      const movies = data.results;
      showMovies(movies, dom_element, path_type);
  
      // return moviesData;
    } catch (error) {
      throw new Error("something went wrong", error);
    }
    // Within Fetch get the response and call showMovies() with the data , dom_element, and path type
  }
  
  // fetchMovies('https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213');
  //  ** Function that displays the movies to the DOM **
  const showMovies = (movies, dom_element, path_type) => {
  
    // Create a variable that grabs id or class
    const movieElem = document.querySelector(dom_element);
  
  
  
    // Loop through object
    for (let movie of movies) {
  
      // Within loop create an img element
      let imageElement = document.createElement('img')
  
      // Set attribute
      imageElement.setAttribute('data-id', movie.id)
  
      // Set source
      imageElement.src = `https://image.tmdb.org/t/p/original${movie[path_type]}`
  
      // Add event listener to handleMovieSelection() onClick
      imageElement.addEventListener('click', e => {
        handleMovieSelection(e)
      })
  
      // Append the imageElement to the dom_element selected
      movieElem.appendChild(imageElement);
  
    }
  }
  
  // ** Function that fetches Netflix Originals **
  function getOriginals() {
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213`;
    fetchMovies(url, ".original__movies", "poster_path")
  }
  // ** Function that fetches Trending Movies **
  function getTrendingNow() {
    const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045`;
    fetchMovies(url, "#trending", "poster_path")
  }
  // ** Function that fetches Top Rated Movies **
  function getTopRated() {
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1`;
    fetchMovies(url, "#top_rated", "backdrop_path")
  }
  
  // ** BONUS **
  
  // ** Fetches URL provided and returns response.json()
  async function getMovieTrailer(id) {
    let url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`
    return await fetch(url).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('something went wrong')
      }
    })
  }
  
  // ** Function that adds movie data to the DOM
  const setTrailer = trailers => {
    const iframe = document.getElementById('movieTrailer')
    const movieNotFound = document.querySelector('.movieNotFound')
  
    // If there is a trailer add the src for it
    if (trailers.length > 0) {
      movieNotFound.classList.add('d-none')
      iframe.classList.remove('d-none')
      iframe.src = `https://www.youtube.com/embed/${trailers[0].key}`
    } else {
      iframe.classList.add('d-none')
      movieNotFound.classList.remove('d-none')
    }
  }
  
  
  const handleMovieSelection = e => {
    const id = e.target.getAttribute('data-id');
    // here we need the id of the movie
    getMovieTrailer(id).then(data => {
      const results = data.results
      const youtubeTrailers = results.filter(result => {
        if (result.site == 'YouTube' && result.type == 'Trailer') {
          return true
        } else {
          return false
        }
      })
      setTrailer(youtubeTrailers)
    })
  
    // open modal
    $('#trailerModal').modal('show')
    // we need to call the api with the ID
  }
  