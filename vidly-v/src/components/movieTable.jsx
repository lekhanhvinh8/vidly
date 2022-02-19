import React, { Component } from "react";
import { Link } from "react-router-dom";
import Like from "./Common/like";
import Table from "./Common/table";

class MovieTable extends Component {
  constructor(props) {
    super(props);
    this.columns[5].content = this.renderDeleteContent();
  }

  columns = [
    {
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
        <Like liked={movie.liked} onLike={() => this.props.onLike(movie)} />
      ),
    },
    {
      key: "delete",
      content: null,
    },
  ];

  render() {
    const { movies, sortColumn, onSort } = this.props;
    return (
      <Table
        columns={this.columns}
        data={movies}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }

  renderDeleteContent = () => {
    const { user } = this.props;
    if (user && user.isAdmin)
      return (movie) => (
        <button
          onClick={() => this.props.onDelete(movie)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      );

    return null;
  };
}

export default MovieTable;
