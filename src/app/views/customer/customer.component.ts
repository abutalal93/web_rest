import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from '../services/http.service';
import { NotifyService } from '../services/notify.service';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SocketioService } from '../services/socket-one-service';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

declare var $: any;

@Component({
  selector: 'app-customer',
  templateUrl: 'customer.component.html',
  styleUrls: ['customer.component.scss'],
})
export class CustomerComponent implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;

  orderForm: FormGroup;

  qrInfo = null

  isLoaded = false;

  cart = [];

  showCart = false;

  currentItemList = [];

  showRunningOrder = false;

  orderList = [];

  showMenu = true;

  popupItemList = [];
  selectedItemList = [];
  selectedCategory = null;
  selectedProduct = null;

  selectedOrder = null;
  showInvoice = false;

  search = '';

  searchItemList = [];

  showSearch = false;


  checked: false;

  socket: Socket;

  constructor(private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private httpService: HttpService,
    private notifyService: NotifyService,
    private socketService: SocketioService) {

  }


  searchItem(event: any) {
    console.log('searchItem: ')
    this.search = event.target.value;
    if(this.search.length > 0){
      console.log('this.search: '+this.search)
      this.showSearch = true;
    }else{
      console.log('false')
      this.showSearch = false;
    }
  }

  sendMessage(message) {
    this.socket.emit('rest-', message);
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

      this.setupCustomerSocketConnection(this.qrInfo.id);

      this.qrInfo.categoryList.forEach(category => {
        category.itemList.map(v => Object.assign(v, { quantity: 1 }))
        category.itemList.forEach(item => {
          this.searchItemList.push(item);
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

    if(this.cookieService.check('cart')){
      this.cart = JSON.parse(this.cookieService.get('cart'));
    }

  }

  setupCustomerSocketConnection(channelId) {
    this.socket = io(environment.socketUrl);

    this.socket.on('customer-'+channelId, (data: string) => {
      console.log(data);
      this.ngOnInit();
    });
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

  backInvoice(){
    this.showRunningOrder = true;
    this.showCart = false;
    this.showMenu = false;
    this.showInvoice = false;
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

    this.cookieService.set('cart',JSON.stringify(this.cart));

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

        this.sendMessage({ channelId: this.qrInfo.restId, body: 'hello waiters'});

        this.cookieService.delete('cart');

        this.notifyService.addToast({ title: "Success", msg: "Order Created Successfully: " + response.data, timeout: 10000, theme: '', position: 'top-center', type: 'success' });

        await this.ngOnInit();

        this.cart = [];

        this.orderForm.reset();

      } else {
        this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      }
    }
  }

  openItemDetailsDialog(item){

    // this.selectedCategory = selectedCategory;
    this.selectedProduct = item;

    this.popupItemList = item.itemSpecs.detailList;

    this.myModal.show();
  }

  closeModal(){
    this.myModal.hide();
  }

  checkItem(values: any, item: any) {
    switch (values.currentTarget.checked) {
      case true:
        $('#check' + item.id).addClass('image-checkbox-checked');
        this.selectedItemList.push(item);
        break;
      case false:
        $('#check' + item.id).removeClass('image-checkbox-checked');
        this.selectedItemList = this.selectedItemList.filter(currentItem => currentItem.id !== item.id);
        break;
    }
  }

  addSaveDetails() {
    console.log('this.selectedItemList.length: ', this.selectedItemList.length);
    //----------------- push item into discounts -----------------------------------//
    // let itemIndex = this.specsList.findIndex(specs => specs.counter === currentSpecs.counter);
    // this.specsList[specsIndex].alias = this.settingForm.get('alias' + currentSpecs.counter).value;

    // this.selectedItemList.forEach(item =>{ 
    //   this.popupItemList = this.popupItemList.filter(currentItem => currentItem.id !== item.id);
    // });

    // this.selectedItemList.forEach(item =>{ 
    //   this.finalItemList.push(item);
    // });

    this.clearSelectedItems();
    this.myModal.hide();
  }

  clearSelectedItems() {
    this.selectedItemList = [];
  }

  viewInvoice(order){
    this.showRunningOrder = false;
    this.showCart = false;
    this.showMenu = false;
    this.showInvoice = true;
    this.selectedOrder = order;
  }
}
