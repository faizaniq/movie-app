const movieURL = 'http://localhost:3000/movies'

document.addEventListener('DOMContentLoaded', function(event){
  const allMovies = document.querySelector('.all-movies')
  const card = document.querySelector('.card')
  const addMovieContainer = document.querySelector('.add-movie')
  const addName = document.getElementById('add-name')
  const addCategory = document.getElementById('add-category')
  const addDescription = document.getElementById('add-description')
  const addImage = document.getElementById('add-image')
  const addReview = document.getElementById('review')
  const form = document.getElementById('edit-form')
  const updateBttn = document.getElementById('update')
  const deleteBttn = document.getElementById('delete')


  displayAllMovies()

  // GET movies
  function movieFetcher(){
    return fetch(movieURL)
    .then(res => res.json())
  }

  function fetchAMovie(id){
    return fetch(`${movieURL}/${id}`)
    .then(res => res.json())
  }

  // display all & edit forms
  function displayAllMovies(){
    movieFetcher()
    .then(movies => {
      movies.forEach(movie => {
        renderMovie(movie, allMovies)
        let reviewDiv = document.querySelector(`#review-${movie.id}`)
        movie.review.forEach(function(review){
        reviewDiv.innerHTML += `<li>${review}</li>`
        })
      })
    })
  }
    // add & render new movie
  function postMovie(){
    let newMovieReviewArray = []
    console.log(addReview.value)
    if (addReview.value !== "") {
      newMovieReviewArray.push(addReview.value)
    }
    return fetch(movieURL, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: addName.value,
        category: addCategory.value,
        description: addDescription.value,
        image: addImage.value,
        review: newMovieReviewArray
      }), // body data type must match "Content-Type" header
      // allMovies.innerHTML = ""
    }).then(res => res.json())
  }

  function addNewMovie(){
    postMovie()
    .then(movie => {
      renderMovie(movie, allMovies)
      let reviewDiv = document.querySelector(`#review-${movie.id}`)
      movie.review.forEach(function(review){
      reviewDiv.innerHTML += `<li>${review}</li>`
      })
      addName.value = ""
      addCategory.value = ""
      addDescription.value = ""
      addReview.value = ""
      addImage.value = ""
    })
  }

    // open edit form
  function toggleEditForm(target) {
    const editForm = target.parentNode.querySelector('.edit-movie')
    if (!editForm.style.display || editForm.style.display === "none") {
      editForm.style.display = "block"
    } else {
      editForm.style.display = "none"
    }
  }
    // open add form
  function toggleAddForm(container) {
    if (!container.style.display || container.style.display === "none") {
      container.style.display = "block"
    } else {
      container.style.display = "none"
    }
  }

  function renderMovie(movie, location){
    location.innerHTML +=
    `
    <div class="outer-card" id="outer-card-${movie.id}">
      <div class="flip-card" id="flip-card-${movie.id}">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div data-movie-id=${movie.id}>
              <div class="card">
                <img src=${movie.image} alt=${movie.name} class='card-image'>
              </div>
            </div>
          </div>

          <div class="flip-card-back">
          <br/>
            <h4>${movie.name}</h4>
            <p class="category">${movie.category}</p>
            <p>${movie.description}</p>
            <div id="review-${movie.id}">
            </div>
          </div>
        </div>
        <button type="button" class="editmovie btn btn-dark btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-movie-id=${movie.id}>Edit</button>
       <br/>
      </div>
    </div>
    `
  }

  function formBuilder(movie){
    let nameField = document.getElementById('edit-name')
    nameField.value = movie.name
    let catField = document.getElementById('edit-category')
    catField.value = movie.category
    let urlField = document.getElementById('edit-image')
    urlField.value = movie.image
    let descField = document.getElementById('edit-description')
    descField.value = movie.description
    let reviewField = document.getElementById('edit-review')
    reviewField = ""
  }

  function deleteMovie(movieId){
    return fetch(`${movieURL}/${movieId}`, {
        method: "DELETE",
    }).then(res => res.json())
  }

  function patchMovie(editName, editDescription, editCategory, editImage, reviewArray, movieId){
    return fetch(`${movieURL}/${movieId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      {
        name: editName,
        category: editCategory,
        description: editDescription,
        image: editImage,
        review: reviewArray
      }),
    }).then(res => res.json())
  }

  function updateMovie(editName, editDescription, editCategory, editImage, reviewArray, movieId, outerCard){
    patchMovie(editName, editDescription, editCategory, editImage, reviewArray, movieId)
    .then(movie => {
      renderMovie(movie, outerCard)
      let reviewDiv = document.querySelector(`#review-${movie.id}`)
      movie.review.forEach(function(review){
      return reviewDiv.innerHTML += `<li>${review}</li>`
      })
    })
  }

  // PATCH, DELETE
  document.addEventListener('click', (e) => {
    if (e.target.value === 'Submit') {
      e.preventDefault()
      addNewMovie()
    } else if (e.target.value === 'Delete') {
      e.preventDefault()
      let movieId = deleteBttn.dataset.id
      let outerCard = document.getElementById(`outer-card-${movieId}`)
      deleteMovie(movieId)
      .then(() => {
        console.log(e.target.offsetParent.parentElement)
        outerCard.remove()
      })
    } else if (e.target.value === 'Update') {
        e.preventDefault()
        let editName = e.target.parentElement.name.value
        let editDescription = e.target.parentElement.description.value
        let editCategory = e.target.parentElement.category.value
        let editImage = e.target.parentElement.url.value
        let movieId = e.target.dataset.id
        let flipCard = document.getElementById(`flip-card-${movieId}`)
        let outerCard = document.getElementById(`outer-card-${movieId}`)
        let editReview = e.target.parentElement.review.value
          return fetch(`${movieURL}/${movieId}`)
          .then(res => res.json())
          .then(movie => {
          let reviewArray = movie.review
          if (editReview !== "") {
            reviewArray.push(editReview)
            updateMovie(editName, editDescription, editCategory, editImage, reviewArray, movieId, outerCard)
            editReview = ""
            flipCard.remove()
          } else {
            updateMovie(editName, editDescription, editCategory, editImage, reviewArray, movieId, outerCard)
            flipCard.remove()
            editReview = ""
          }
        })
    } else if (e.target.className === "editmovie btn btn-dark btn btn-primary") {
      let id = e.target.dataset.movieId
      fetchAMovie(id)
      .then(movie => formBuilder(movie))
    }
  })

  // Add & Edit toggler
  document.addEventListener('click', (e) => {
    const target = e.target
    if (target.className === 'editmovie btn btn-dark btn btn-primary') {
      console.log(target.dataset.movieId)
      updateBttn.dataset.id = target.dataset.movieId
      deleteBttn.dataset.id = target.dataset.movieId
      console.log(updateBttn.dataset.id)
    } else if (target.innerText === 'Add Movie') {
      toggleAddForm(addMovieContainer)
    }
  })


})//DOM Loader
