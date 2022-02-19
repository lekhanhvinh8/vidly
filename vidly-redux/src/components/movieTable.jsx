import React, { Component } from "react";
import { Link } from "react-router-dom";
import Like from "./Common/like";
import Table from "./Common/table";
import { likeMovie, deleteMovie } from "../store/movies";
import { changeSort } from "../store/moviePage";
import { connect } from "react-redux";

class MovieTable extends Component {
  constructor(props) {
    super(props);
    this.columns[5].content = this.renderDeleteContent();
  }

  columns = [
    {
      path: "title",
      key: "title",
      content: (movie) => (
        <Link to={"/movies/" + movie._id}>{movie.title}</Link>
      ),
      label: "Title",
    },
    { path: "genre.name", label: "Genre" },
    { path: "numberInStock", label: "Stock" },
    { path: "dailyRentalRate", label: "Rate" },
    {
      key: "like",
      content: (movie) => (
        <Like
          liked={movie.liked}
          onLike={() => this.props.likeMovie(movie._id)}
        />
      ),
    },
    {
      key: "delete",
      content: null,
    },
  ];

  render() {
    const { movies } = this.props;
    return (
      <Table
        columns={this.columns}
        data={movies}
        sortColumn={this.props.sortColumn}
        onSort={(sortColumn) => this.props.changeSort(sortColumn)}
      />
    );
  }

  renderDeleteContent = () => {
    const { user } = this.props;
    if (user && user.isAdmin)
      return (movie) => (
        <button
          onClick={() => this.props.deleteMovie(movie._id)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      );

    return null;
  };
}

const mapStateToProps = (state) => ({
  sortColumn: state.ui.moviePage.sortColumn,
});

const mapDispatchToProps = (dispatch) => ({
  likeMovie: (movieId) => dispatch(likeMovie(movieId)),
  deleteMovie: async (movieId) => await dispatch(deleteMovie(movieId)),
  changeSort: (sortColumn) => dispatch(changeSort(sortColumn)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MovieTable);
