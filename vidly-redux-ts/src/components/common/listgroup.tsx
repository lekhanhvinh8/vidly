import React, { Component } from "react";

interface Props {
  items: Array<any>;
  textProperty?: string;
  valueProperty?: string;
  selectedItem: any;
  onItemSelect: Function;
}

class ListGroup extends Component<Props> {
  render() {
    const {
      items,
      textProperty = "name",
      valueProperty = "_id",
      selectedItem,
      onItemSelect,
    } = this.props;
    return (
      <ul className="list-group">
        {items.map((i) => (
          <li
            key={i[valueProperty]}
            className={
              i === selectedItem ? "list-group-item active" : "list-group-item"
            }
            onClick={() => onItemSelect(i)}
          >
            {i[textProperty]}
          </li>
        ))}
      </ul>
    );
  }
}

export default ListGroup;
