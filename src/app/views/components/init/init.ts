import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { DashboardComponent } from '../dashboard/dashboard';
import { ProductsComponent } from '../products/products';
import { TransactionsComponent } from '../transactions/transactions';

@Component({
  selector: 'zm-init',
  imports: [MatSlideToggleModule, MatTabsModule, ProductsComponent, DashboardComponent, TransactionsComponent],
  templateUrl: './init.html',
  styleUrl: './init.scss'
})
export class InitComponent {
activeTab = 0;

onTabChange(event: any) {
  this.activeTab = event.index;
}

}
