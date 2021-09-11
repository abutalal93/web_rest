import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from '../services/http.service';
import { NotifyService } from '../services/notify.service';

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

  constructor(private activatedRoute: ActivatedRoute, private cookieService: CookieService, private httpService: HttpService, private notifyService: NotifyService) { }

  async ngOnInit() {

    this.loadForm();

    let qrId = this.activatedRoute.snapshot.queryParamMap.get('qrId');

    console.log("QR ID "+qrId);

    let request = {
      method: "GET",
      path: "customer/qr/info?qrId="+qrId,
      body: null
    };

    let response = await this.httpService.httpRequest(request);


    console.log(response);

    if(response.status == 200){

      this.isLoaded = true;

      this.qrInfo = response.data;

      this.qrInfo.categoryList.forEach(category => {
        category.itemList.map(v => Object.assign(v, {quantity: 0}))
      });

      console.log('this.qrInfo: ',this.qrInfo);

    }else{
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

  viewItem(category){
    this.currentItemList = category.itemList
  }

  viewCategoty(){
    this.currentItemList = [];
  }


  plus(item){
    item.quantity = item.quantity + 1;
  }

  minus(item){
    if(item.quantity == 0){
      return;
    }
    item.quantity = item.quantity - 1;
  }


  addToCart(item){
    let sectionIndex = this.cart.findIndex(currentItem => currentItem.id === item.id);
    if(sectionIndex == -1){
      this.cart.push(item);
    }else{
      this.cart[sectionIndex].quantity = item.quantity;
    }

    console.log('this.cart: ',this.cart)
  }


  deleteItemFromCart(item){
    this.cart = this.cart.filter(currentItem => currentItem.id !== item.id);
  }


  findOrderTotal(){

    let total = 0;
    this.cart.forEach(item => {
      let lineTotal = item.quantity * item.unitPrice;
      total = total + lineTotal;
    });

    return total;
  }


  async order(){
    if (this.orderForm.valid) {

      let request = {
        method: "POST",
        path: "customer/order/submit",
        body: this.orderForm.value
      };

      request.body.cartList = this.cart;

      let response = await this.httpService.httpRequest(request);
      console.log(response);
      if(response.status == 200){

        this.notifyService.addToast({ title: "Success", msg: "Operation Done Successfully", timeout: 10000, theme: '', position: 'top-center', type: 'success' });
    
        this.cart = [];

        this.orderForm.reset();

      }else{
        this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      }
    }
  }

}
