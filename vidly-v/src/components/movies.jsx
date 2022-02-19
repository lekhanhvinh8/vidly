import React, { Component } from "react";
import { toast } from "react-toastify";
import { getGenres } from "../services/genreService";
import { getMovies, deleteMovie } from "../services/movieService";
import MovieTable from "./movieTable";
import Pagination from "./Common/pagination";
import ListGroup from "./Common/listgroup";
import { pagingnate } from "./utils/pagingnate";
import _ from "lodash";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 3,
    currentPage: 1,
    selectedGenre: "",
    search: "",
    sortColumn: { path: "title", order: "asc" },
  };

  async componentDidMount() {
    const genres = [{ _id: "", name: "All Genres" }, ...(await getGenres())];
    const movies = await getMovies();
    this.setState({ movies, genres });
    this.setState({ selectedGenre: genres[0] });
  }

  render() {
    const {
      movies: allMovies,
      pageSize,
      currentPage,
      genres,
      selectedGenre,
    } = this.state;

    const { pagedCount, pagedMovies } = this.getPagedMovies();
    const { user } = this.props;

    if (allMovies.filter((m) => !m.isDeleted).length === 0)
      return <p>There are no movies</p>;

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={genres}
            selectedItem={selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          {user && (
            <button
              className="btn btn-success"
              onClick={() => {
                this.props.history.push("/movies/new");
              }}
            >
              New Movie
            </button>
          )}

          <p>Showing {pagedMovies.filter((m) => !m.isDeleted).length} movies</p>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="search..."
              value={this.state.search}
              onChange={this.handleSearch}
            />
          </div>            
          <MovieTable
            movies={pagedMovies}
            user={user}
            sortColumn={this.state.sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={pagedCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handelPageChange}
          />
        </div>
      </div>
    );
  }

  handleDelete = async (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);

    const deletedMovie = { ...movie };
    deletedMovie.isDeleted = true;

    movies[index] = deletedMovie;

    this.setState({ movies });

    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response) {
        if (ex.response.status === 404)
          toast.error("This movie has alreadly been deleted");

        if (ex.response.status === 400) toast.error("You are not logged in");

        if (ex.response.status === 403) toast.error("You have no permission");
      }

      deletedMovie.isDeleted = false;
      movies[index] = deletedMovie;

      this.setState({ movies });
    }
  };

  handleLike = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);

    movies[index].liked = !movies[index].liked;

    this.setState({ movies });
  };

  handelPageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, currentPage: 1, search: "" });
    this.cleanDeletedMovies();
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  cleanDeletedMovies = () => {
    const movies = this.state.movies.filter((m) => !m.isDeleted);
    this.setState({ movies });
  };

  handleSearch = (e) => {
    const search = e.currentTarget.value;
    this.setState({ search, selectedGenre: "", currentPage: 1 });
  };

  getPagedMovies = () => {
    const {
      movies: allMovies,
      pageSize,
      currentPage,
      selectedGenre,
      sortColumn,
      search,
    } = this.state;

    const filteredMovies = selectedGenre._id
      ? allMovies.filter((m) => m.genre._id === selectedGenre._id)
      : allMovies;

    const sorted = _.orderBy(
      filteredMovies,
      [sortColumn.path],
      [sortColumn.order]
    );

    const searched = sorted.filter((m) =>
      m.title.trim().toLowerCase().includes(search.toLowerCase())
    );

    const movies = pagingnate(searched, currentPage, pageSize);

    return { pagedCount: searched.length, pagedMovies: movies };
  };
}

export default Movies;
