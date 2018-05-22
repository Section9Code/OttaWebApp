import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentItemModel, ContentItemService } from 'services/content-item.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-content-search-layout',
  templateUrl: './content-search-layout.component.html',
  styleUrls: ['./content-search-layout.component.css']
})
export class ContentSearchLayoutComponent implements OnInit, OnDestroy {
  // What the user searched for
  searchCriteria = '';
  // Content items found
  searchResults: ContentItemModel[] = [];
  isLoading = false;

  subParams: Subscription;
  subSearch: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentItemService: ContentItemService
  ) { }

  ngOnInit() {
    // Get the search parameters
    this.subParams = this.route.queryParams.subscribe(params => {
      this.searchCriteria = params['s'];
      this.searchForResults();
    });
  }

  ngOnDestroy(): void {
    this.subParams.unsubscribe();
  }

  searchForResults() {
    this.isLoading = true;
    console.log('Search - start search', this.searchCriteria);
    this.subSearch = this.contentItemService.search(this.searchCriteria).subscribe(
      response => {
        console.log('Search - results', response);
        this.isLoading = false;
        this.searchResults = response;
      },
      error => {
        console.log('Search - error', error);
        this.isLoading = false;
      }
    );
  }

  clear(){
    this.searchCriteria = '';
    this.searchResults = [];
  }

}
