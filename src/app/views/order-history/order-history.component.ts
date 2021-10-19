import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInOutTranslate } from '../animations/animation';
import { HttpService } from '../services/http.service';
import { NotifyService } from '../services/notify.service';
import Swal from 'sweetalert2'
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  templateUrl: 'order-history.component.html',
  animations: [fadeInOutTranslate],
  styleUrls: ['order-history.component.scss'],

})
export class OrderHistoryComponent implements OnInit {


  categoryList = [];

  @ViewChild('myModal') public myModal: ModalDirective;


  orderList = [];

  reference = '';
  dateFrom = '';
  dateTo = '';

  orderInfo = {
    totalAmount: null,
    email: null,
    mobileNumber: null,
    customerName: null,
    trackList: null,
    itemList: null
  };

  page = 0;
  activePage = 1;
  pages = [];
  pageSize = 10;
  fromNext = false;
  
  showTable = true;

  editMode = false;

  async ngOnInit() {
    this.loadForm();
    await this.findOrderHistory();
  }

  constructor(private httpService: HttpService, private notifyService: NotifyService) {

  }


  loadForm() {

  }

  async findOrderHistory() {

    if (!this.fromNext) {
      this.activePage = 1;
    }

    let request = {
      method: "GET",
      path: "rest/order/history?reference="+this.reference+"&dateFrom="+this.dateFrom+"&dateTo"+this.dateTo+"&page="+this.page+"&size="+this.pageSize,
      body: null
    };

    let response = await this.httpService.httpRequest(request);
    console.log(response);
    if (response.status == 200) {
      this.orderList = response.data.pageList;
      let numberOfPages = response.data.numberOfPages;
      this.fillPageArray(numberOfPages);
    } else {
      this.fillPageArray(1);
      this.orderList = [];
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
    this.page = this.activePage-1
    this.fromNext = true;
    await this.findOrderHistory();
    console.log("+this.activePage+", this.activePage);
  }

  pay(OrderHistory){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to pay OrderHistory!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, pay it!',
      cancelButtonText: 'No, keep it',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        return new Promise(async (resolve) => {
          let request = {
            method: "PUT",
            path: "rest/OrderHistory/pay?OrderHistoryId="+OrderHistory.id,
            body: null
          };
    
          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if(response.status == 200){
    
            Swal.fire(
              'Changed!',
              'Your OrderHistory has been paid.',
              'success'
            )
            await this.findOrderHistory();
    
          }else{
            Swal.fire(
              'Error!',
              'Error ocurred please try again.',
              'error'
            )
          }

        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your OrderHistory is safe :)',
          'error'
        )
      }
    });
  }

  approve(OrderHistory){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to approve OrderHistory!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, keep it',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        return new Promise(async (resolve) => {
          let request = {
            method: "PUT",
            path: "rest/OrderHistory/approve?OrderHistoryId="+OrderHistory.id,
            body: null
          };
    
          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if(response.status == 200){
    
            Swal.fire(
              'Changed!',
              'Your OrderHistory has been approved.',
              'success'
            )
            await this.findOrderHistory();
    
          }else{
            Swal.fire(
              'Error!',
              'Error ocurred please try again.',
              'error'
            )
          }

        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your OrderHistory is safe :)',
          'error'
        )
      }
    });
  }

  deliver(OrderHistory){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to deliver OrderHistory!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, deliver it!',
      cancelButtonText: 'No, keep it',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        return new Promise(async (resolve) => {
          let request = {
            method: "PUT",
            path: "rest/OrderHistory/deliver?OrderHistoryId="+OrderHistory.id,
            body: null
          };
    
          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if(response.status == 200){
    
            Swal.fire(
              'Changed!',
              'Your OrderHistory has been delivered.',
              'success'
            )
            await this.findOrderHistory();
    
          }else{
            Swal.fire(
              'Error!',
              'Error ocurred please try again.',
              'error'
            )
          }

        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your OrderHistory is safe :)',
          'error'
        )
      }
    });
  }


  async viewTrack(OrderHistory){

    let request = {
      method: "GET",
      path: "rest/order/timeline?orderId="+OrderHistory.id,
      body: null
    };

    let response = await this.httpService.httpRequest(request);
    console.log(response);
    if (response.status == 200) {
      this.orderInfo = response.data;
      this.myModal.show();
    } else {
    }
    
  }
}
