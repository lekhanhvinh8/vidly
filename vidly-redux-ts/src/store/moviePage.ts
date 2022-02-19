import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Genre } from "../models/movies";
import { SortColumn } from "../models/table";
import { AppDispatch, RootState } from "./store";

interface MoviePageState {
  pageSize: number;
  currentPage: number;
  selectedGenre: Genre;
  search: string;
  sortColumn: SortColumn;
}

const slice = createSlice({
  name: "moviePage",
  initialState: {
    pageSize: 3,
    currentPage: 1,
    selectedGenre: {},
    search: "",
    sortColumn: { path: "title", order: "asc" as const },
  } as MoviePageState,
  reducers: {
    genreSelected: (page, action: PayloadAction<Genre>) => {
      page.selectedGenre = action.payload;
    },
    genreChanged: (page, action: PayloadAction<Genre>) => {
      page.selectedGenre = action.payload;
      page.currentPage = 1;
      page.search = "";
    },
    pageChanged: (page, action: PayloadAction<number>) => {
      page.currentPage = action.payload;
    },
    searchChanged: (page, action) => {
      page.search = action.payload.searchValue;
      page.selectedGenre = action.payload.selectedGenre;
      page.currentPage = 1;
    },
    sortColumnChanged: (page, action: PayloadAction<SortColumn>) => {
      page.sortColumn = action.payload;
    },
  },
});

export default slice.reducer;

const {
  genreSelected,
  genreChanged,
  pageChanged,
  searchChanged,
  sortColumnChanged,
} = slice.actions;

//Action Creator
export const selectGenre = (genre: Genre) => (dispatch: AppDispatch) => {
  dispatch(genreSelected(genre));
};

export const changeGenre = (genre: Genre) => (dispatch: AppDispatch) => {
  dispatch(genreChanged(genre));
};

export const changePage = (page: number) => (dispatch: AppDispatch) => {
  dispatch(pageChanged(page));
};

export const search =
  (searchValue: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const firstGenre = getState().entities.genres[0];
    dispatch(searchChanged({ searchValue, selectedGenre: firstGenre }));
  };

export const changeSort =
  (sortColumn: SortColumn) => (dispatch: AppDispatch) => {
    dispatch(sortColumnChanged(sortColumn));
  };
