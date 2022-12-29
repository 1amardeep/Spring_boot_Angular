import { Product } from "./Product";

export interface ProductResponse{
    product: Product[],
    page: {
        size: number,
        totalElements: number,
        totalPages: number,
        number: number,
    }
}