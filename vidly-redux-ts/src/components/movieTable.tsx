import React, { Component } from "react";
import Like from "./common/like";
import Table from "./common/table";
import { Movie } from "./../models/movies";
import { Column, SortColumn } from "../models/table";
import { AppDispatch, RootState } from "../store/store";
import { likeMovie, deleteMovie } from "./../store/movies";
import { changeSort } from "../store/moviePage";
import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";

interface Props extends PropsFromRedux {
  movies: Array<Movie>;
  user: any;
}

class MovieTable extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.columns[5].content = this.renderDeleteContent();
  }

  columns: Array<Column> = [
    {
      path: "title",
      key: "title",
      content: (movie: Movie) => (
        <Link to={"/movies/" + movie._id}>{movie.title}</Link>
      ),
      label: "Title",
    },
    { path: "genre.name", label: "Genre" },
    { path: "numberInStock", label: "Stock" },
    { path: "dailyRentalRate", label: "Rate" },
    {
      key: "like",
      content: (movie: Movie) => (
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
        onSort={this.props.changeSort}
      />
    );
  }

  renderDeleteContent = () => {
    const { user } = this.props;
    if (user && user.isAdmin)
      return (movie: Movie) => (
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

const mapStateToProps = (state: RootState) => ({
  sortColumn: state.ui.moviePage.sortColumn,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  likeMovie: (movieId: string) => dispatch(likeMovie(movieId)),
  deleteMovie: async (movieId: string) => await dispatch(deleteMovie(movieId)),
  changeSort: (sortColumn: SortColumn) => dispatch(changeSort(sortColumn)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(MovieTable);
