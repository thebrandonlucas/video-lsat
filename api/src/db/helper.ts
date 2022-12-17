export function getOffset(currentPage = 1, listPerPage: number) {
  return (currentPage - 1) * listPerPage;
}

export function emptyOrRows(rows?: any[]) {
  if (!rows) {
    return [];
  }
  return rows;
}
