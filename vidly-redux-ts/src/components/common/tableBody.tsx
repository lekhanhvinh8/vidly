import React, { Component } from "react";
import _, { PropertyPath } from "lodash";
import { Column } from "../../models/table";

interface Props {
  data: Array<any>;
  columns: Array<Column>;
}

class TableBody extends Component<Props> {
  renderCell(item: any, column: Column) {
    if (column.content) return column.content(item);
    return _.get(item, column.path as PropertyPath);
  }
  createKey(item: any, column: Column) {
    return item._id + (column.path || column.key);
  }
  render() {
    const { data, columns } = this.props;

    return (
      <tbody>
        {data.map((item) => {
          if (item.isDeleted) return null;

          return (
            <tr key={item._id}>
              {columns.map((column) => (
                <td key={this.createKey(item, column)}>
                  {this.renderCell(item, column)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    );
  }
}

export default TableBody;
