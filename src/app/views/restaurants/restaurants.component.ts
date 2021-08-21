import { Component, OnInit } from '@angular/core';
import { fadeInOutTranslate } from '../animations/animation';
import { HttpService } from '../services/http.service';
import { NotifyService } from '../services/notify.service';

@Component({
  templateUrl: 'restaurants.component.html',
  animations: [fadeInOutTranslate]
})
export class RestaurantsComponent implements OnInit {


  restaurantsList = [];

  page = 0;
  activePage = 1;
  pages = [];
  pageSize = 10;
  fromNext = false;
  
  showTable = true;

  async ngOnInit() {
    await this.findRestaurants();
  }

  constructor(private httpService: HttpService, private notifyService: NotifyService) {

  }

  async findRestaurants() {

    if (!this.fromNext) {
      this.activePage = 1;
    }

    let request = {
      method: "GET",
      path: "sp/rest/search",
      body: null
    };

    let response = await this.httpService.httpRequest(request);
    console.log(response);
    if (response.status == 200) {
      this.restaurantsList = response.data.pageList;
      let numberOfPages = response.data.numberOfPages;
      this.fillPageArray(numberOfPages);
    } else {
      this.fillPageArray(1);
      this.restaurantsList = [];
    }

    this.fromNext = false;
  }

  fillPageArray(numberOfPages) {
    this.pages = [];
    for (var index = 0; index < numberOfPages; index++) {
      this.pages.push({ pageName: index + 1, pageNumber: index });
    }
    console.log("pages", this.pages);
  }

  async onSelect(page) {
    this.activePage = page.pageName;
    this.fromNext = true;
    await this.findRestaurants();
    console.log("+this.activePage+", this.activePage);
  }
}
