import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transactions } from '../../models/trasaction.model';


@Injectable({
    providedIn: 'root'
})
export class TransactionsService {
    private apiUrl = 'https://localhost:7163/api/Transaction';

    constructor(private http: HttpClient) { }

    getAllTransactions(): Observable<Transactions[]> {
        return this.http.get<Transactions[]>(`${this.apiUrl}/get-allTransactions`);
    }

    addTransaction(transaction: Transactions): Observable<any> {
        return this.http.post(`${this.apiUrl}/add-transactions`, transaction);
    }

    editTransaction(transaction: Transactions): Observable<any> {
        return this.http.put(`${this.apiUrl}/edit-transactions/`, transaction);
    }

    deleteTransaction(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete-transactions/${id}`);
    }

    getTransactionByFilter(searchType: string): Observable<Transactions[]> {
        return this.http.get<Transactions[]>(`${this.apiUrl}/getTransactionsByFilter/${searchType}`);
    }

}
