export interface Column {
  path?: string;
  key?: string;
  label?: string;
  content?: Function | null;
}

export interface SortColumn {
  path: string;
  order: "asc" | "desc";
}
