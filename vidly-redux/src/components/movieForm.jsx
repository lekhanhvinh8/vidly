import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import Form from "./Common/form";
import { getMovie, saveMovie } from "../services/movieService";
import { getGenres, getGenre } from "../services/genreService";
import { addMovie } from "../store/movies";
import { connect } from "react-redux";

class MovieForm extends Form {
  state = {
    movieId: "",
    genres: [],
    selectedGenreId: "",
    data: {
      title: "",
      numberInStock: "",
      rate: "",
    },
    errors: {},
  };

  schema = {
    title: Joi.string().required().min(5),
    numberInStock: Joi.number().required().integer().min(0),
    rate: Joi.number().required().min(0).max(10),
  };

  async componentDidMount() {
    const { params, path } = this.props.match;

    let movie;
    try {
      if (path !== "/movies/new") movie = await getMovie(params.movieId);
    } catch (ex) {}

    if (!movie && path !== "/movies/new")
      this.props.history.replace("/not-found");

    const data = { ...this.state.data };
    const genres = await getGenres();
    let selectedGenreId = genres[0]._id;
    let movieId;

    if (movie) {
      data.title = movie.title;
      data.numberInStock = movie.numberInStock;
      data.rate = movie.dailyRentalRate;
      selectedGenreId = movie.genre._id;
      movieId = movie._id;
    }

    this.setState({ movieId, genres, selectedGenreId, data });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSave}>
          {this.renderInput("title", "Title")}
          {this.renderGenresDropdownList()}
          {this.renderInput("numberInStock", "Number In Stock", "number")}
          {this.renderInput("rate", "Rate", "number")}

          {this.renderButton("Save", {
            className: "btn btn-success",
          })}
        </form>
      </div>
    );
  }

  handleSave = async (e) => {
    this.handleSubmit(e);

    try {
      const newMovie = await saveMovie(this.getMovieFromState());
      this.props.addMovie(newMovie);

      this.props.history.push("/movies");
    } catch (ex) {
      if (ex.response) {
        if (ex.response.status === 400) toast.error("you are not logged in");
      }
    }
  };

  renderGenresDropdownList = () => {
    const { genres, selectedGenreId } = this.state;

    return (
      <div className="form-group">
        <label htmlFor={"genre"} className="control-label">
          Genre
        </label>
        <select
          id="genre"
          className="form-control"
          value={selectedGenreId}
          onChange={this.handleSelectChange}
        >
          {genres.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  handleSelectChange = async (e) => {
    const genre = await getGenre(e.currentTarget.value);
    if (genre) {
      this.setState({ selectedGenreId: genre._id });
    } else alert("Error !!!");
  };

  getMovieFromState = () => {
    const { movieId, selectedGenreId, data } = this.state;
    const movie = {};
    movie._id = movieId;
    movie.genreId = selectedGenreId;
    movie.title = data.title;
    movie.numberInStock = data.numberInStock;
    movie.dailyRentalRate = data.rate;

    return movie;
  };
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  addMovie: (movie) => dispatch(addMovie(movie)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MovieForm);
