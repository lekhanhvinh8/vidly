import React from "react";
import Joi from "joi";
import { toast } from "react-toastify";
import Form, { FormState } from "./common/form";
import { getMovie, saveMovie } from "../services/movieService";
import { getGenres, getGenre } from "../services/genreService";
import { addMovie } from "../store/movies";
import { connect, ConnectedProps } from "react-redux";
import { Genre } from "../models/movies";
import { AppDispatch, RootState } from "../store/store";
import { Movie } from "./../models/movies";

interface State extends FormState {
  movieId: string;
  genres: Genre[];
  selectedGenreId: string;
}

class MovieForm extends Form<PropsStore> {
  state: State = {
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

  schema = Joi.object().keys({
    title: Joi.string().required().min(5),
    numberInStock: Joi.number().required().integer().min(0),
    rate: Joi.number().required().min(0).max(10),
  });

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
          {this.renderInput("title", "Title", this.schema)}
          {this.renderGenresDropdownList()}
          {this.renderInput(
            "numberInStock",
            "Number In Stock",
            this.schema,
            "number"
          )}
          {this.renderInput("rate", "Rate", this.schema, "number")}

          {this.renderButton("Save", this.schema, {
            className: "btn btn-success",
          })}
        </form>
      </div>
    );
  }

  handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    this.handleSubmit(this.schema)(e);

    try {
      const newMovie = await saveMovie(this.getMovieFromState()).catch((ex) => {
        if (ex.response) {
          if (ex.response.status === 400) toast.error("you are not logged in");
        }
      });
      //this.props.addMovie(newMovie);

      this.props.history.push("/movies");
    } catch (ex) {}
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

  handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genre = await getGenre(e.currentTarget.value);
    if (genre) {
      this.setState({ selectedGenreId: genre._id });
    } else alert("Error !!!");
  };

  getMovieFromState = () => {
    const { movieId, selectedGenreId, data } = this.state;
    const movie = {
      _id: movieId,
      genreId: selectedGenreId,
      title: data.title,
      numberInStock: data.numberInStock,
      dailyRentalRate: data.rate,
    };

    return movie;
  };
}

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addMovie: (movie: Movie) => dispatch(addMovie(movie)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsStore = ConnectedProps<typeof connector>;

export default connector(MovieForm);
