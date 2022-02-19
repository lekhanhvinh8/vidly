import React, { Component } from "react";

class ListGroup extends Component {
  render() {
    const { items, textProperty, valueProperty, selectedItem, onItemSelect } =
      this.props;
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

ListGroup.defaultProps = {
  textProperty: "name",
  valueProperty: "_id",
};

export default ListGroup;
