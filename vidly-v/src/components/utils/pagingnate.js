import _ from "lodash";

export function pagingnate(items, page, pageSize) {
  //Get pageSize items of page

  const startIndex = (page - 1) * pageSize;
  return _(items).slice(startIndex).take(pageSize).value();
}
