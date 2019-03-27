document.addEventListener('DOMContentLoaded', function(event){

  const movieURL = 'http://localhost:3000/movies'
  const allMovies = document.querySelector('.all-movies')
  const card = document.querySelector('.card')
  const addMovieContainer = document.querySelector('.add-movie')
  const addName = document.getElementById('add-name')
  const addCategory = document.getElementById('add-category')
  const addDescription = document.getElementById('add-description')
  const addImage = document.getElementById('add-image')
  const addReview = document.getElementById('review')
  // const addForm = document.getElementById('add-form')

  function movieFetcher(){
    allMovies.innerHTML = ""
    fetch(movieURL)
    .then(res => res.json())
    .then(movies => {
    movies.forEach(movie => {
    console.log(movie.name)
    allMovies.innerHTML +=
      `
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
            <li>${movie.review}</li>
          </div>
        </div>
        <br/>
        <div><button class="editmovie" data-id="${movie.id}">Edit</button></div>
        <br/>
        <div class="edit-movie" style="">
          <form id="edit-form">
            <input type="text" name="name" id="edit-name" size="42" placeholder="Name" value='${movie.name}'>
            <br/>
            <input type="text" name="category" id="edit-category" size="42" placeholder="Category" value='${movie.category}'>
            <br/>
            <input type="text" name="url" id="edit-image" size="42" placeholder="Image URL" value='${movie.image}'>
            <br/>
            <input type="text" name="description" id="edit-description" size="42" placeholder="Description..." value='${movie.description}'>
            <br/>
            <input type="text" name="review" id="edit-review" size="42" placeholder="Review..." value='${movie.review}'>
            <br/>
            <input type="submit" value="Update" data-id=${movie.id}></input>
            <input type="submit" value="Delete" data-id=${movie.id}></input>
            <input type="submit" value="Add to Favorites" data-id=${movie.id}></input>
          </form>
        </div>
      </div>
      `
      })
    })
    // addMovieContainer.reset()
  }
  movieFetcher()

  document.addEventListener('click', (e) => {
    e.preventDefault()
    if (e.target.value === 'Submit') {
      e.preventDefault()
      console.log(addName.value)
      console.log(addCategory.value)
      console.log(addDescription.value)
      console.log(addImage.value)
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
          review: addReview.value
        }), // body data type must match "Content-Type" header
      }).then( res => movieFetcher())
      addName.value.reset()
    } else if (e.target.value === 'Update') {
      console.log('here in update');
      e.preventDefault()
      // let editName = document.getElementById('edit-name')
      let editName = e.target.parentElement.name.value
      let editDescription = e.target.parentElement.description.value
      let editCategory = e.target.parentElement.category.value
      let editImage = e.target.parentElement.url.value
      let editReview = e.target.parentElement.review.value
      console.log(editName)
      console.log(editDescription)
      console.log(editCategory)
      console.log(editImage)
      let movieId = e.target.dataset.id
      console.log()
      fetch(`${movieURL}/${movieId}`, {
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
        }).then( res => {
          return res.json()
        }).then(res => {
          console.log('here is the response from json server', res);
          // right now you say go fetch all the movies again and re-add all to DOM

          // instead
          // find the Dom node that represents this movie (with the same id)
          // clear and reset the innerHTML of this dom node
          movieFetcher()
        })

      } else if (e.target.value === 'Delete') {
        e.preventDefault()
        let movieId = e.target.dataset.id
        console.log('here')
        fetch(`${movieURL}/${movieId}`, {
          method: "DELETE",
        }).then( res => movieFetcher())
      }
  })


  document.addEventListener('click', (e) => {
    if (e.target.className === 'editmovie') {
      console.log('clicked');
      const editForm = e.target.parentNode.parentNode.querySelector('.edit-movie')
      if (!editForm.style.display || editForm.style.display === "none") {
        editForm.style.display = "block"
      } else {
        editForm.style.display = "none"
      }
    } else if (e.target.innerText === 'Add Movie') {
      console.log(addMovieContainer)
      const addForm = document.getElementById('add-form')
      if (!addForm.style.display || addForm.style.display === "none") {
        addMovieContainer.style.display = "block"
      } else {
        addMovieContainer.style.display = "none"
      }
    }
  })



})
