export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next: string | null;
  prev: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
