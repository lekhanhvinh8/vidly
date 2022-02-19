import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

interface Props {
  itemsCount: number;
  pageSize: number;
  currentPage: number;
  onPageChange: Function;
}

class Pagination extends Component<Props> {
  // static proptypes = {
  //   itemsCount: PropTypes.number.isRequired,
  //   pageSize: PropTypes.number.isRequired,
  //   currentPage: PropTypes.number.isRequired,
  //   onPageChange: PropTypes.func.isRequired,
  // };

  render() {
    const { itemsCount, pageSize, currentPage, onPageChange } = this.props;
    const pagesCount = Math.ceil(itemsCount / pageSize);
    if (pagesCount <= 1) return null;

    const pages = _.range(1, pagesCount + 1);

    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li
            key={0}
            className={currentPage === 1 ? "page-item disabled" : "page-item"}
            onClick={() =>
              onPageChange(currentPage > 1 ? currentPage - 1 : currentPage)
            }
          >
            <Link className="page-link" to="#">
              Previous
            </Link>
          </li>
          {pages.map((p) => (
            <li
              key={p}
              className={p === currentPage ? "page-item active" : "page-item"}
            >
              <Link
                className="page-link"
                onClick={() => onPageChange(p)}
                to="#"
              >
                {p}
              </Link>
            </li>
          ))}
          <li
            key={pagesCount + 1}
            className={
              currentPage === pagesCount ? "page-item disabled" : "page-item"
            }
            onClick={() =>
              onPageChange(
                currentPage < pagesCount ? currentPage + 1 : currentPage
              )
            }
          >
            <Link className="page-link" to="#">
              Next
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Pagination;
