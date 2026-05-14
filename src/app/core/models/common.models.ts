export interface IdName {
  id: number|string;
  name: string;
}
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
export interface PaginationState {
  pageSize: number;
  pageNumber: number;
  totalItems: number;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}
