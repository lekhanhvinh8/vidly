import React, { Component } from "react";
import { connect } from "react-redux";
import MovieTable from "./movieTable";
import Pagination from "./Common/pagination";
import ListGroup from "./Common/listgroup";
import { loadGenres } from "../store/genres";
import { loadMovies, cleanDeletedMovies } from "../store/movies";
import {
  changePage,
  selectGenre,
  changeGenre,
  search,
} from "../store/moviePage";
import { pagingnate } from "./utils/pagingnate";
import _ from "lodash";

class Movies extends Component {
  async componentDidMount() {
    if (this.props.genres.length === 1) {
      await this.props.loadGenres();
      this.props.selectGenre(this.props.genres[0]);
    }
    if (this.props.movies.length === 0) await this.props.loadMovies();
  }

  render() {
    const {
      movies: allMovies,
      genres,
      pageSize,
      currentPage,
      selectedGenre,
    } = this.props;

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

  handelPageChange = (page) => {
    this.props.changePage(page);
  };

  handleGenreChange = (genre) => {
    this.props.changeGenre(genre);
    this.props.cleanDeletedMovies();
  };

  handleSearch = (e) => {
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

const mapStateToProps = (state) => ({
  genres: state.entities.genres,
  movies: state.entities.movies,
  pageSize: state.ui.moviePage.pageSize,
  currentPage: state.ui.moviePage.currentPage,
  selectedGenre: state.ui.moviePage.selectedGenre,
  search: state.ui.moviePage.search,
  sortColumn: state.ui.moviePage.sortColumn,
});

const mapDispatchToProps = (dispatch) => ({
  loadGenres: async () => await dispatch(loadGenres()),
  loadMovies: async () => await dispatch(loadMovies()),
  selectGenre: (genre) => dispatch(selectGenre(genre)),
  changeGenre: (genre) => dispatch(changeGenre(genre)),
  changePage: (page) => dispatch(changePage(page)),
  cleanDeletedMovies: () => dispatch(cleanDeletedMovies()),
  changeSearch: (searchValue) => dispatch(search(searchValue)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Movies);
