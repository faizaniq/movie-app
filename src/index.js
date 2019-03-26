document.addEventListener('DOMContentLoaded', function(event){

  const movieURL = 'http://localhost:3000/movies'
  const allMovies = document.querySelector('.all-movies')
  const card = document.querySelector('.card')

  const addName = document.getElementById('add-name')
  const addCategory = document.getElementById('add-category')
  const addDescription = document.getElementById('add-description')
  const addImage = document.getElementById('add-image')

  // const editName = document.getElementById('edit-name')
  // const editCategory = document.getElementById('edit-category')
  // const editDescription = document.getElementById('edit-description')
  // const editImage = document.getElementById('edit-image')

  const editMovieBttn = document.querySelector('Edit')

  const addForm = document.getElementById('add-form')
  // const editForm = document.getElementbyId('edit-form')

  function movieFetcher(){
    allMovies.innerHTML = ""
    fetch(movieURL)
    .then(res => res.json())
    .then(movies => {
    movies.forEach(movie => {
    // console.log(movie)
    allMovies.innerHTML +=
      `
      <div data-movie-id=${movie.id}
        <div class="card">
          <img src=${movie.image} alt=${movie.name} class='card-image'>
          <h4>${movie.name}</h4>
          <p class="category">${movie.category}</p>
          <p>${movie.description}</p>
          <p><button data-id="${movie.id}">Edit</button></p>
        </div>
        <div class="edit-movie">
          <h2>Edit Movie:</h2>
          <form id="edit-form">
            <input type="text" name="name" id="edit-name" placeholder="Name">
            <br/>
            <input type="text" name="category" id="edit-category" placeholder="Category">
            <br/>
            <input type="text" name="description" id="edit-description" placeholder="Description...">
            <br/>
            <input type="text" name="url" id="edit-image" placeholder="Image URL">
            <br/>
            <br/>
            <input type="submit" value="Update" data-id=${movie.id}></input>
            <input type="submit" value="Delete" data-id=${movie.id}></input>
          </form>
        </div>
      </div>
      `
      })
    })
  }
  movieFetcher()

  // document.addEventListener("submit", function(e){
  //   e.preventDefault()
  //   console.log(movieName.value)
  //   console.log(movieCategory.value)
  //   console.log(movieDescription.value)
  //   console.log(movieImage.value)
  //   return fetch(movieURL, {
  //     method: "POST", // *GET, POST, PUT, DELETE, etc.
  //     headers: {
  //         "Content-Type": "application/json",
  //         // "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body: JSON.stringify({
  //       name: movieName.value,
  //       category: movieCategory.value,
  //       description: movieDescription.value,
  //       image: movieImage.value
  //     }), // body data type must match "Content-Type" header
  //   }).then( res => movieFetcher())
  //   addForm.reset()
  // })

  document.addEventListener('click', (e) => {
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
          image: addImage.value
        }), // body data type must match "Content-Type" header
      }).then( res => movieFetcher())
    } else if (e.target.value === 'Update') {
      e.preventDefault()
      // let editName = document.getElementById('edit-name')
      let editName = e.target.parentElement.name.value
      let editDescription = e.target.parentElement.description.value
      let editCategory = e.target.parentElement.category.value
      let editImage = e.target.parentElement.url.value

      console.log(editName)
      console.log(editDescription)
      console.log(editCategory)
      console.log(editImage)
      let movieId = e.target.dataset.id
      console.log(movieId)
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
            image: editImage
          }),
        }).then( res => movieFetcher())
      } else if (e.target.value === 'Delete') {
        e.preventDefault()
        let movieId = e.target.dataset.id
        console.log('here')
        fetch(`${movieURL}/${movieId}`, {
          method: "DELETE",
        }).then( res => movieFetcher())
      }
    })



})
