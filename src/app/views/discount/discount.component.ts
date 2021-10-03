import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInOutTranslate } from '../animations/animation';
import { HttpService } from '../services/http.service';
import { NotifyService } from '../services/notify.service';
import Swal from 'sweetalert2'
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
declare var $: any;

@Component({
  templateUrl: 'discount.component.html',
  animations: [fadeInOutTranslate]
})
export class DiscountComponent implements OnInit {


  @ViewChild('myModal') public myModal: ModalDirective;
  
  discountTypeList = [
    {
      code: "FIXED",
      name: "Fixed"
    },
    {
      code: "PERCENTAGE",
      name: "Percentage"
    }
  ]

  discountList = [];

  selectedItemList = [];


  itemList = [];

  popupItemList = [];

  finalItemList = [];

  page = 0;
  activePage = 1;
  pages = [];
  pageSize = 10;
  fromNext = false;
  
  showTable = true;

  discountForm: FormGroup;

  editMode = false;

  specsList = [];

  async ngOnInit() {
    this.loadForm();
    await this.findDiscount();
    await this.findItem();
  }

  constructor(private httpService: HttpService, private notifyService: NotifyService) {

  }

  loadForm() {
    this.discountForm = new FormGroup({
      discountId: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      discountType: new FormControl('', [Validators.required]),
      discountValue: new FormControl('', [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]),
      startDateTime: new FormControl('', [Validators.required]),
      endDateTime: new FormControl('', [Validators.required]),
    });
  }

  async findDiscount() {

    if (!this.fromNext) {
      this.activePage = 1;
    }

    let request = {
      method: "GET",
      path: "rest/discount/search",
      body: null
    };

    let response = await this.httpService.httpRequest(request);
    console.log(response);
    if (response.status == 200) {
      this.discountList = response.data.pageList;
      let numberOfPages = response.data.numberOfPages;
      this.fillPageArray(numberOfPages);
    } else {
      this.fillPageArray(1);
      this.discountList = [];
    }

    this.fromNext = false;
  }

  async findItem() {

    if (!this.fromNext) {
      this.activePage = 1;
    }

    let request = {
      method: "GET",
      path: "rest/item/search?page=0&size=100",
      body: null
    };

    let response = await this.httpService.httpRequest(request);
    console.log(response);
    if (response.status == 200) {
      this.itemList = response.data.pageList;
      this.popupItemList = response.data.pageList;
    }
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
    await this.findItem();
    console.log("+this.activePage+", this.activePage);
  }

  markFormGroupToched(){
    (<any>Object).values(this.discountForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  async save(){
    this.markFormGroupToched();

    console.log(this.discountForm.valid);

    if (this.discountForm.valid) {

      let request = {
        method: "POST",
        path: "rest/discount/create",
        body: this.discountForm.value
      };

      let itemIdList = [];
      this.finalItemList.forEach(item =>{ 
        itemIdList.push(item.id);
      });

      request.body.itemIdList = itemIdList;

      let response = await this.httpService.httpRequest(request);
      console.log(response);
      if(response.status == 200){

        this.notifyService.addToast({ title: "Success", msg: "Item Added Successfully", timeout: 10000, theme: '', position: 'top-center', type: 'success' });
      
      
        this.showTable=!this.showTable;

        this.discountForm.reset();

        await this.findDiscount();

      }else{
        this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      }
    }
  }

  async update(){
    this.markFormGroupToched();

    console.log(this.discountForm.valid);

    if (this.discountForm.valid) {

      let request = {
        method: "POST",
        path: "rest/discount/update",
        body: this.discountForm.value
      };

      let itemIdList = [];
      this.finalItemList.forEach(item =>{ 
        itemIdList.push(item.id);
      });

      request.body.itemIdList = itemIdList;

      let response = await this.httpService.httpRequest(request);
      console.log(response);
      if(response.status == 200){

        this.notifyService.addToast({ title: "Success", msg: "Item Updated Successfully", timeout: 10000, theme: '', position: 'top-center', type: 'success' });
      
      
        this.showTable=!this.showTable;

        this.discountForm.reset();

        await this.findDiscount();

      }else{
        this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      }
    }
  }


  editDiscount(item){

    this.showTable=!this.showTable;

    this.editMode = true;

    this.discountForm.controls['discountId'].setValue(item.id);
    this.discountForm.controls['name'].setValue(item.name);
    this.discountForm.controls['discountType'].setValue(item.discountType);
    this.discountForm.controls['discountValue'].setValue(item.discountValue);
    this.discountForm.controls['startDateTime'].setValue(item.startDateTime);
    this.discountForm.controls['endDateTime'].setValue(item.endDateTime);

    this.finalItemList = item.itemList;

    this.finalItemList.forEach(item =>{ 
      this.popupItemList = this.popupItemList.filter(currentItem => currentItem.id !== item.id);
    });
    
  }

  deleteItemForPopUp(item){
    this.finalItemList = this.finalItemList.filter(currentItem => currentItem.id !== item.id);//finalItemList
    this.popupItemList.push(item);//popupItemList
  }

  openItemDialog(){
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

  addItems() {
    console.log('this.selectedItemList.length: ', this.selectedItemList.length);
    //----------------- push item into discounts -----------------------------------//

    this.selectedItemList.forEach(item =>{ 
      this.popupItemList = this.popupItemList.filter(currentItem => currentItem.id !== item.id);
    });

    this.selectedItemList.forEach(item =>{ 
      this.finalItemList.push(item);
    });

    this.clearSelectedItems();
    this.myModal.hide();
  }

  clearSelectedItems() {
    this.selectedItemList = [];
  }

  deleteDiscount(discount){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete Discount!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        return new Promise(async (resolve) => {
          let request = {
            method: "DELETE",
            path: "rest/discount/delete?discountId="+discount.id,
            body: this.discountForm.value
          };
    
          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if(response.status == 200){
    
            Swal.fire(
              'Deleted!',
              'Your discount has been deleted.',
              'success'
            )
            await this.findDiscount();
    
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
          'Your Item is safe :)',
          'error'
        )
      }
    });
  }

  activeOrInactive(discount){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to change Discount status!',
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
            path: "rest/discount/activeInactive?discountId="+discount.id,
            body: this.discountForm.value
          };
    
          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if(response.status == 200){
    
            Swal.fire(
              'Changed!',
              'Your discount has been changed.',
              'success'
            )
            await this.findDiscount();
    
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
          'Your Item is safe :)',
          'error'
        )
      }
    });
  }
}
