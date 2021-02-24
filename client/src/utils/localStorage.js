export const getSavedMovieIds = () => {
  const savedMovieIds = JSON.parse(localStorage.getItem("saved_movies")) || [];
  // console.log(typeof savedMovieIds);
  return savedMovieIds;
};

export const saveMovieIds = (movieIdArr) => {
  if (movieIdArr.length) {
    localStorage.setItem("saved_movies", JSON.stringify(movieIdArr));

    // console.log(typeof JSON.stringify(movieIdArr)); //str
    // console.log(movieIdArr); //str
    // console.log(JSON.stringify(movieIdArr)); //str
    // console.log(movieIdArr.length); // already in ls
  } else {
    localStorage.removeItem("saved_movies");
  }
  // console.log(movieIdArr);
};

export const removeMovieId = (movieId) => {
  const savedMovieIds = localStorage.getItem("saved_movies")
    ? JSON.parse(localStorage.getItem("saved_movies"))
    : null;

  if (!savedMovieIds) {
    return false;
  }

  const updatedSavedMovieIds = savedMovieIds?.filter(
    (savedMovieId) => savedMovieId !== parseInt(movieId)
  );
  localStorage.setItem("saved_movies", JSON.stringify(updatedSavedMovieIds));

  console.log(typeof movieId); // string
  // console.log(typeof parseInt(movieId)); // Int
  console.log(movieId); // in grey
  console.log(parseInt(movieId)); // in blue
  console.log(typeof savedMovieIds); // obj
  console.log(typeof savedMovieIds[0]); // number
  console.log(savedMovieIds[0]); // number in blue
  return true;
};
