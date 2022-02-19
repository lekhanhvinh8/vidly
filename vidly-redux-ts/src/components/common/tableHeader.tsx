import React, { Component } from "react";
import "font-awesome/css/font-awesome.css";
import { Column, SortColumn } from "../../models/table";

interface Props {
  columns: Array<Column>;
  sortColumn: SortColumn;
  onSort: (sortColumn: SortColumn) => void;
}

class TableHeader extends Component<Props> {
  render() {
    const { columns } = this.props;
    return (
      <thead>
        <tr>{columns.map((column) => this.renderCell(column))}</tr>
      </thead>
    );
  }

  raiseSort = (path: string) => {
    const sortColumn = { ...this.props.sortColumn };

    if (path === sortColumn.path) {
      sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
    } else {
      sortColumn.path = path;
      sortColumn.order = "asc";
    }

    this.props.onSort(sortColumn);
  };

  renderCell = (column: Column) => {
    if (!column.path)
      return (
        <th key={column.key} scope="col">
          {column.label}
        </th>
      );

    return (
      <th
        className="clickable"
        key={column.path}
        onClick={() => this.raiseSort(column.path as string)}
        scope="col"
      >
        {column.label}
        {this.renderSortIcon(column)}
      </th>
    );
  };

  renderSortIcon = (column: Column) => {
    const { sortColumn } = this.props;

    if (column.path !== sortColumn.path) return null;

    if (sortColumn.order === "asc") return <i className="fa fa-sort-asc"></i>;

    return <i className="fa fa-sort-desc"></i>;
  };
}

export default TableHeader;
