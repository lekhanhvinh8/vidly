import TableBody from "./tableBody";
import TableHeader from "./tableHeader";
import { Column, SortColumn } from "../../models/table";

interface Props {
  columns: Array<Column>;
  sortColumn: SortColumn;
  data: Array<any>;
  onSort: (sortColumn: SortColumn) => void;
}

const Table = (props: Props) => {
  const { columns, sortColumn, data, onSort } = props;

  return (
    <table className="table table-hover">
      <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
      <TableBody data={data} columns={columns} />
    </table>
  );
};

export default Table;
