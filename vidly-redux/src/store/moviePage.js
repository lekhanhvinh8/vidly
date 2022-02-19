import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "moviePage",
  initialState: {
    pageSize: 3,
    currentPage: 1,
    selectedGenre: "",
    search: "",
    sortColumn: { path: "title", order: "asc" },
  },
  reducers: {
    genreSelected: (page, action) => {
      page.selectedGenre = action.payload;
    },
    genreChanged: (page, action) => {
      page.selectedGenre = action.payload;
      page.currentPage = 1;
      page.search = "";
    },
    pageChanged: (page, action) => {
      page.currentPage = action.payload;
    },
    searchChanged: (page, action) => {
      page.search = action.payload.searchValue;
      page.selectedGenre = action.payload.selectedGenre;
      page.currentPage = 1;
    },
    sortColumnChanged: (page, action) => {
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
export const selectGenre = (genre) => (dispatch) => {
  dispatch(genreSelected(genre));
};

export const changeGenre = (genre) => (dispatch) => {
  dispatch(genreChanged(genre));
};

export const changePage = (page) => (dispatch) => {
  dispatch(pageChanged(page));
};

export const search = (searchValue) => (dispatch, getState) => {
  const firstGenre = getState().entities.genres[0];
  dispatch(searchChanged({ searchValue, selectedGenre: firstGenre }));
};

export const changeSort = (sortColumn) => (dispatch) => {
  dispatch(sortColumnChanged(sortColumn));
};
