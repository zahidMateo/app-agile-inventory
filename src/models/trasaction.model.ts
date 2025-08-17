export interface Transactions {
    productID: number,
    transactionID: number;
    date?: Date;
    transactionType?: string;
    quantity?: number;
    unitPrice?: number;
    totalPrice?: number;
    detail?: string;
}
