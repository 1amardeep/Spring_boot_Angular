import { ProductCategory } from "./ProductCategory";

export class Product {

    constructor(public id: number,
        public sku: String,
        public name: String,
        public category: ProductCategory,
        public description: String,
        public unitPrice: number,
        public imageUrl: String,
        public active: boolean,
        public unitsInStock: number,
        public dateCreated: String,
        public lastUpdated: String | null
    ) { }
}