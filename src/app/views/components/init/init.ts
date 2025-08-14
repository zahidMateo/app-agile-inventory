import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { DashboardComponent } from '../dashboard/dashboard';
import { ProductsComponent } from '../products/products';

@Component({
  selector: 'zm-init',
  imports: [MatSlideToggleModule,MatTabsModule,ProductsComponent,DashboardComponent],
  templateUrl: './init.html',
  styleUrl: './init.scss'
})
export class InitComponent {

}
