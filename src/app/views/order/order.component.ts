import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInOutTranslate } from '../animations/animation';
import { HttpService } from '../services/http.service';
import { NotifyService } from '../services/notify.service';
import Swal from 'sweetalert2'
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth-service.service';
import { SocketioService } from '../services/socket-one-service';
import { CookieService } from 'ngx-cookie-service';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Component({
  templateUrl: 'order.component.html',
  animations: [fadeInOutTranslate],
  styleUrls: ['order.component.scss'],
})
export class OrderComponent implements OnInit {


  categoryList = [];

  @ViewChild('myModal') public myModal: ModalDirective;

  @ViewChild('timeLineModal') public timeLineModal: ModalDirective;

  orderList = [];

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

  socket: Socket

  async ngOnInit() {
    let user = JSON.parse(this.cookieService.get('user'));
    this.setupRestSocketConnection(user.restId);

    this.loadForm();

    await this.findorder();
  }

  setupRestSocketConnection(channelId) {
    this.socket = io(environment.socketUrl);

    this.socket.on('rest-'+channelId, (data: string) => {
      console.log(data);
      this.findorder();
    });
  }

  sendMessage(message) {
    this.socket.emit('customer-', message);
  }

 
  constructor(private httpService: HttpService,
    private notifyService: NotifyService,
    public authService: AuthService,
    private cookieService: CookieService
  ) {

  }


  loadForm() {
  }

  async findorder() {

    if (!this.fromNext) {
      this.activePage = 1;
    }

    let request = {
      method: "GET",
      path: "rest/order/search",
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
    this.fromNext = true;
    await this.findorder();
    console.log("+this.activePage+", this.activePage);
  }

  cancel(order) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to cancel order!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        return new Promise(async (resolve) => {
          let request = {
            method: "PUT",
            path: "rest/order/cancel?orderId=" + order.id,
            body: null
          };

          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if (response.status == 200) {

            Swal.fire(
              'Changed!',
              'Your order has been canceled.',
              'success'
            )
            await this.findorder();

          } else {
            Swal.fire(
              'Error!',
              'Error ocurred please try again.',
              'error'
            )
          }

          this.sendMessage({ channelId: order.qrId, body: 'hello customer'});
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your order is safe :)',
          'error'
        )
      }
    });
  }

  pay(order) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to pay order!',
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
            path: "rest/order/pay?orderId=" + order.id,
            body: null
          };

          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if (response.status == 200) {

            Swal.fire(
              'Changed!',
              'Your order has been paid.',
              'success'
            )
            await this.findorder();

          } else {
            Swal.fire(
              'Error!',
              'Error ocurred please try again.',
              'error'
            )
          }

          this.sendMessage({ channelId: order.qrId, body: 'hello customer'});
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your order is safe :)',
          'error'
        )
      }
    });
  }

  approve(order) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to approve order!',
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
            path: "rest/order/approve?orderId=" + order.id,
            body: null
          };

          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if (response.status == 200) {

            Swal.fire(
              'Changed!',
              'Your order has been approved.',
              'success'
            )
            await this.findorder();

          } else {
            Swal.fire(
              'Error!',
              'Error ocurred please try again.',
              'error'
            )
          }

          this.sendMessage({ channelId: order.qrId, body: 'hello customer'});
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your order is safe :)',
          'error'
        )
      }
    });
  }

  deliver(order) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to deliver order!',
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
            path: "rest/order/deliver?orderId=" + order.id,
            body: null
          };

          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if (response.status == 200) {

            Swal.fire(
              'Changed!',
              'Your order has been delivered.',
              'success'
            )
            await this.findorder();

          } else {
            Swal.fire(
              'Error!',
              'Error ocurred please try again.',
              'error'
            )
          }

          this.sendMessage({ channelId: order.qrId, body: 'hello customer'});
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your order is safe :)',
          'error'
        )
      }
    });
  }


  async viewItem(order) {

    let request = {
      method: "GET",
      path: "rest/order/timeline?orderId=" + order.id,
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
      this.timeLineModal.show();
    } else {
    }
    
  }
}
