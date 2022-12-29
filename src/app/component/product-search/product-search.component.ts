import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {

  searchText!: String;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.searchText = "";
  }

  search() {
    if (this.searchText != "") {
      this.router.navigateByUrl(`/search/${this.searchText}`);
      this.searchText = "";
    }
  }

}
