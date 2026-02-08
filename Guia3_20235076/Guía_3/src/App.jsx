import { useState } from "react";
import { Logo, Nav, NumResults, Search } from "./components/Nav";
import { Box } from "./components/Box";
import { MovieList } from "./components/Movie";
import { WatchedMoviesContainer, WatchedMoviesList, WatchedSummary } from
  "./components/WatchedMovie";
import { useFetchMovies } from "./hooks/useFetchMovies";
import { MovieDetails } from "./components/MovieDetails";
import { useEffect } from "react";

/**
* Componente principal de la aplicación.
*/
export default function App() {

  // Estado para la búsqueda de películas, actualiza esta varible de estado
  const [query, setQuery] = useState("");

  // Obtiene películas basadas en la consulta, mandi a llamar el custom hook
  const { movies, isLoading, error } = useFetchMovies(query);

  // Estado de películas vistas y guardarlas en la BD
  const [watched, setWatched] = useState(() => {
      const storedWatched = localStorage.getItem("watchedMovies");
      return storedWatched ? JSON.parse(storedWatched) : [];
  });

  useEffect(() => {
    localStorage.setItem("watchedMovies", JSON.stringify(watched));
  }, [watched]);
  
  // Estado para la película seleccionada
  const [selectedId, setSelectedId] = useState(null);

  /**
  * Maneja la selección de una película.
  * @param {string} id - ID de la película seleccionada.
  */

  function handleSelectMovie(id) {
    setSelectedId(id);
  }

  /**
  * Cierra los detalles de la película.
  */
  function handleCloseMovie() {
    setSelectedId(null);
  }

  /**
  * Agrega una película a la lista de vistas.
  * @param {Object} movie - Película a agregar.
  */
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  //funcion para eliminar
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  
  return (
    <>
      <Nav>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Nav>
      <main className="main">
        <Box>
          {isLoading && <p className="loader">Cargando...</p>}
          {error && <p className="error">⛔ {error}</p>}
          <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
        </Box>

        <Box>
          <WatchedMoviesContainer>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched}
              />
            ) : (
              <>
                <WatchedSummary watched={watched} />
                <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched}/>
              </>
            )}
          </WatchedMoviesContainer>
        </Box>
      </main>
    </>
  );
}

///& es un if simple
//59 si la variable esta vacia muestra el mensaje de error
