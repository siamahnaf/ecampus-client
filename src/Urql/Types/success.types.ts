export interface Success {
    success: boolean;
    message: string;
}

export interface Meta {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}