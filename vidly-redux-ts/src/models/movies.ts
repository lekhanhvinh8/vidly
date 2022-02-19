export interface Movie {
  _id: string;
  title: string;
  numberInStock: number;
  dailyRentalRate: number;
  genre: Genre;
  liked?: boolean;
  isDeleted?: boolean;
}

export interface Genre {
  _id: string;
  name: string;
}
