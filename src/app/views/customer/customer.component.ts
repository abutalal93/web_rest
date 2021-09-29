import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from '../services/http.service';
import { NotifyService } from '../services/notify.service';
import { map } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-customer',
  templateUrl: 'customer.component.html',
  styleUrls: ['customer.component.scss'],
})
export class CustomerComponent implements OnInit {

  orderForm: FormGroup;

  qrInfo = null

  isLoaded = false;

  cart = [];

  showCart = false;

  currentItemList = [];

  showRunningOrder = false;

  orderList = [];

  showMenu = true;

  private socket: Socket;


  checked: false;


  constructor(private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private httpService: HttpService,
    private notifyService: NotifyService) {

  }

  async ngOnInit() {

    this.loadForm();

    let qrId = this.activatedRoute.snapshot.queryParamMap.get('qrId');

    console.log("QR ID " + qrId);

    let request = {
      method: "GET",
      path: "customer/qr/info?qrId=" + qrId,
      body: null
    };

    let response = await this.httpService.httpRequest(request);


    console.log(response);

    if (response.status == 200) {

      this.isLoaded = true;

      this.qrInfo = response.data;

      this.qrInfo.categoryList.forEach(category => {
        category.itemList.map(v => Object.assign(v, { quantity: 1 }))
        category.itemList.forEach(item => {
          if(item.itemSpecs && item.itemSpecs.detailList.length > 0){
            item.itemSpecs.detailList.forEach(detail => {
              this.orderForm.addControl('detail' + detail.id, new FormControl(null));
            });
          }
        });
      });

      console.log('this.qrInfo: ', this.qrInfo);

      if (this.qrInfo.orderList && this.qrInfo.orderList.length > 0) {
        this.orderList = this.qrInfo.orderList;
        this.showRunningOrder = true;
        this.showCart = false;
        this.showMenu = false;
      }

    } else {
      this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
    }
  }


  loadForm() {
    this.orderForm = new FormGroup({
      name: new FormControl(''),
      mobile: new FormControl('', [Validators.pattern(/^[0][0-9]{9}/)]),
      email: new FormControl('', [Validators.email]),
    });
  }

  viewItem(category) {
    this.currentItemList = category.itemList
  }

  viewCategoty() {
    this.currentItemList = [];
  }


  plus(item) {
    item.quantity = item.quantity + 1;
  }

  minus(item) {
    if (item.quantity == 0) {
      return;
    }
    item.quantity = item.quantity - 1;

    if(item.quantity == 0){
      this.cart = this.cart.filter(currentItem => currentItem.id !== item.id);

      if(this.cart.length == 0){
        this.showRunningOrder = false;
        this.showCart = false;
        this.showMenu = true;
      }
    }
  }


  addToCart(item) {
    let sectionIndex = this.cart.findIndex(currentItem => currentItem.id === item.id);
    if (sectionIndex == -1) {
      this.cart.push(item);
    } else {
      this.cart[sectionIndex].quantity = item.quantity;
    }

    console.log('this.cart: ', this.cart)
  }


  deleteItemFromCart(item) {
    this.cart = this.cart.filter(currentItem => currentItem.id !== item.id);
  }


  findOrderBeforeTax() {

    let total = 0;
    this.cart.forEach(item => {
      let lineTotal = item.quantity * item.unitPrice;
      total = total + lineTotal;
    });

    return total.toFixed(2);
  }


  findTaxTotal() {

    let total = 0;
    this.cart.forEach(item => {
      let lineTotal = ((item.unitPrice * item.quantity) * (item.tax/100))
      total = total + lineTotal;
    });

    return total.toFixed(2);
  }

  findGrantTotal() {

    let total = 0;
    this.cart.forEach(item => {
      let lineTotal = (((item.unitPrice * (item.tax/100)) + item.unitPrice) * item.quantity)
      total = total + lineTotal;
    });

    if(this.qrInfo.serviceFeesType == 'PERCENTAGE'){
      return (total + (this.qrInfo.serviceFees/100)).toFixed(2);
    }else{
      return (total + this.qrInfo.serviceFees).toFixed(2);
    }    
  }

  newOrder(){
    this.showRunningOrder = false;
    this.showCart = false;
    this.showMenu = true;
  }


  async order() {
    if (this.orderForm.valid) {

      let request = {
        method: "POST",
        path: "customer/order/submit",
        body: this.orderForm.value
      };

      let qrId = this.activatedRoute.snapshot.queryParamMap.get('qrId');

      request.body.cartList = this.cart;
      request.body.qrId = qrId;
      request.body.totalAmount = this.findGrantTotal();

      let response = await this.httpService.httpRequest(request);
      console.log(response);
      if (response.status == 200) {

        this.notifyService.addToast({ title: "Success", msg: "Order Created Successfully: " + response.data, timeout: 10000, theme: '', position: 'top-center', type: 'success' });

        await this.ngOnInit();

        this.cart = [];

        this.orderForm.reset();

      } else {
        this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      }
    }
  }

}
