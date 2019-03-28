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


  displayAllMovies()

  // GET movies
  function movieFetcher(){
    return fetch(movieURL)
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
    newMovieReviewArray.push(addReview.value)
    console.log(addReview.value)
    // debugger
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
    .then(movie => renderMovie(movie, allMovies))
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
    <div class="outer-card">
      <div class="flip-card">
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
        <button class="editmovie" data-id="${movie.id}">Edit</button>
        <div class="edit-movie" style="">
          <form id="edit-form">
            <input type="text" name="name" id="edit-name" size="42" placeholder="Name" value='${movie.name}'>
            <br/>
            <input type="text" name="category" id="edit-category" size="42" placeholder="Category" value='${movie.category}'>
            <br/>
            <input type="text" name="url" id="edit-image" size="42" placeholder="Image URL" value='${movie.image}'>
            <br/>
            <input type="text" name="description" id="edit-description" size="42" placeholder="Add Description..." value='${movie.description}'>
            <input type="text" name="review" id="edit-review" size="42" placeholder="Add Review...">
            <br/>
            <br/>
            <input type="submit" value="Update" data-id=${movie.id}></input>
            <input type="submit" value="Delete" data-id=${movie.id}></input>
            <input type="submit" value="Add to Favorites" data-id=${movie.id}></input>
          </form>
        </div>
       <br/>
      </div>
    </div>
    `
  }

  function deleteMovie(movieId){
    return fetch(`${movieURL}/${movieId}`, {
        method: "DELETE",
    }).then(res => res.json())
  }

  function patchMovie(editName, editDescription, editCategory, editImage, editReview, movieId){
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
        review: editReview
      }),
    }).then(res => res.json())
  }

  function updateMovie(editName, editDescription, editCategory, editImage, editReview, movieId, outerCard){
    patchMovie(editName, editDescription, editCategory, editImage, editReview, movieId)
    .then(movie => {
      renderMovie(movie, outerCard)
      let reviewDiv = document.querySelector(`#review-${movie.id}`)
      movie.review.forEach(function(review){
      reviewDiv.innerHTML += `<li>${review}</li>`
      })
    })
  }

  // POST, PATCH, DELETE
  document.addEventListener('click', (e) => {
    if (e.target.value === 'Submit') {
      e.preventDefault()
      addNewMovie()
    } else if (e.target.value === 'Delete') {
      e.preventDefault()
      let movieId = e.target.dataset.id
      deleteMovie(movieId)
      .then(() => {
        console.log(e.target.offsetParent.parentElement)
        e.target.offsetParent.parentElement.remove()
      })
    } else if (e.target.value === 'Update') {
        e.preventDefault()
        let editName = e.target.parentElement.name.value
        let editDescription = e.target.parentElement.description.value
        let editCategory = e.target.parentElement.category.value
        let editImage = e.target.parentElement.url.value
        let editReview = e.target.parentElement.review.value
        let movieId = e.target.dataset.id
        let flipCard = e.target.offsetParent
        let outerCard = e.target.parentNode.parentNode.parentNode.parentNode
        return fetch(`${movieURL}/${movieId}`)
        .then(res => res.json())
        .then(movie => {
          let reviewArray = movie.review
          console.log(' editReview')
          reviewArray.push(editReview)
          updateMovie(editName, editDescription, editCategory, editImage, reviewArray, movieId, outerCard)
          flipCard.remove()
        })
      console.log(reviewArray)
    }
  })

  // Add & Edit toggler
  document.addEventListener('click', (e) => {
    const target = e.target
    if (target.className === 'editmovie') {
      toggleEditForm(target)
    } else if (target.innerText === 'Add Movie') {
      toggleAddForm(addMovieContainer)
    }
  })


})//DOM Loader
