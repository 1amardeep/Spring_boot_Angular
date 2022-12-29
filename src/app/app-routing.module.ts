import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './component/product-list/product-list.component';
import { ProductDetailsComponent } from './component/product-details/product-details.component';

const routes: Routes = [
  {
    component: ProductListComponent,
    path: "search/:keyword"
  },
  {
    component: ProductListComponent,
    path: "category/:id"
  },
  {
    component: ProductListComponent,
    path: "category"
  },
  {
    component: ProductListComponent,
    path: "products"
  },
  {
    component: ProductDetailsComponent,
    path: "products/:id"
  },
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/products',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
