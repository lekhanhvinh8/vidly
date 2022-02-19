import React, { Component } from "react";
import { toast } from "react-toastify";
import { deleteMovie } from "../services/movieService";
import MovieTable from "./movieTable";
import _ from "lodash";
import { Genre, Movie } from "../models/movies";
import { AxiosError } from "axios";
import { AppDispatch, RootState } from "../store/store";
import { loadGenres } from "../store/genres";
import { cleanDeletedMovies, loadMovies } from "./../store/movies";
import ListGroup from "./common/listgroup";
import { connect, ConnectedProps } from "react-redux";
import { changePage, selectGenre } from "../store/moviePage";
import { changeGenre, search } from "./../store/moviePage";
import { RouteComponentProps } from "react-router-dom";
import { pagingnate } from "./utils/pagingnate";
import Pagination from "./common/pagination";

interface Props {
  user: any;
}

class Movies extends Component<PropsFromRedux & RouteComponentProps & Props> {
  async componentDidMount() {
    // if (this.props.genres.length === 1) {
    //   await this.props.loadGenres();
    //   this.props.selectGenre(this.props.genres[0]);
    // }
    // if (this.props.movies.length === 0) await this.props.loadMovies();
    await this.props.loadGenres();
    this.props.selectGenre(this.props.genres[0]);
    await this.props.loadMovies();
  }

  render() {
    const { movies: allMovies, user, pageSize, currentPage } = this.props;

    const { pagedCount, pagedMovies } = this.getPagedMovies();

    if (allMovies.filter((m: Movie) => !m.isDeleted).length === 0)
      return <p>There are no movies</p>;

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.props.genres}
            selectedItem={this.props.selectedGenre}
            onItemSelect={this.handleGenreChange}
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
              value={this.props.search}
              onChange={this.handleSearch}
            />
          </div>
          <MovieTable movies={pagedMovies} user={user} />
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

  handleDelete = async (movie: Movie) => {
    const movies = [...this.props.movies];
    const index = movies.indexOf(movie);

    const deletedMovie = { ...movie };
    deletedMovie.isDeleted = true;

    movies[index] = deletedMovie;

    this.setState({ movies });

    try {
      await deleteMovie(movie._id);
    } catch (exception) {
      const ex = exception as AxiosError;
      console.log(ex.response);
      if (ex.response) {
        console.log(ex);
        if (ex.response.status === 404)
          toast.error("This movie has alreadly been deleted");
        else if (ex.response.status === 400)
          toast.error("You are not logged in");
        else if (ex.response.status === 403)
          toast.error("You have no permission");
        else toast.error("Error !!!");
      }

      deletedMovie.isDeleted = false;
      movies[index] = deletedMovie;

      this.setState({ movies });
    }
  };

  handelPageChange = (page: number) => {
    this.props.changePage(page);
  };

  handleGenreChange = (genre: Genre) => {
    this.props.changeGenre(genre);
    this.props.cleanDeletedMovies();
  };

  handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.currentTarget.value;
    this.props.changeSearch(searchValue);
  };

  getPagedMovies = () => {
    const {
      movies: allMovies,
      pageSize,
      currentPage,
      selectedGenre,
      sortColumn,
      search,
    } = this.props;

    const filteredMovies = selectedGenre._id
      ? allMovies.filter((m: Movie) => m.genre._id === selectedGenre._id)
      : allMovies;

    const sorted: Movie[] = _.orderBy(
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

const mapStateToProps = (state: RootState) => ({
  genres: state.entities.genres,
  movies: state.entities.movies,
  pageSize: state.ui.moviePage.pageSize,
  currentPage: state.ui.moviePage.currentPage,
  selectedGenre: state.ui.moviePage.selectedGenre,
  search: state.ui.moviePage.search,
  sortColumn: state.ui.moviePage.sortColumn,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  loadGenres: async () => await dispatch(loadGenres()),
  loadMovies: async () => await dispatch(loadMovies()),
  selectGenre: (genre: Genre) => dispatch(selectGenre(genre)),
  changeGenre: (genre: Genre) => dispatch(changeGenre(genre)),
  changePage: (page: number) => dispatch(changePage(page)),
  cleanDeletedMovies: () => dispatch(cleanDeletedMovies()),
  changeSearch: (searchValue: string) => dispatch(search(searchValue)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Movies);
