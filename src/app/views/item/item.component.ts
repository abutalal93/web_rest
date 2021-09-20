import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInOutTranslate } from '../animations/animation';
import { HttpService } from '../services/http.service';
import { NotifyService } from '../services/notify.service';
import Swal from 'sweetalert2'

@Component({
  templateUrl: 'item.component.html',
  animations: [fadeInOutTranslate]
})
export class ItemComponent implements OnInit {


  categoryList = [];

  taxTypeList = [
    {
      code: "NA",
      name: "Not applicable"
    },
    {
      code: "EX",
      name: "Exempted"
    },
    {
      code: "AP",
      name: "Applicable"
    }
  ]


  itemList = [];

  page = 0;
  activePage = 1;
  pages = [];
  pageSize = 10;
  fromNext = false;
  
  showTable = true;

  itemForm: FormGroup;

  editMode = false;

  async ngOnInit() {
    this.loadForm();
    await this.findItem();
    await this.findCategory();
  }

  constructor(private httpService: HttpService, private notifyService: NotifyService) {

  }

  async findCategory() {

    if (!this.fromNext) {
      this.activePage = 1;
    }

    let request = {
      method: "GET",
      path: "rest/category/search",
      body: null
    };

    let response = await this.httpService.httpRequest(request);
    console.log(response);
    if (response.status == 200) {
      this.categoryList = response.data.pageList;
      let numberOfPages = response.data.numberOfPages;
      this.fillPageArray(numberOfPages);
    } else {
      this.fillPageArray(1);
      this.categoryList = [];
    }

    this.fromNext = false;
  }

  loadForm() {
    this.itemForm = new FormGroup({
      itemId: new FormControl(''),
      nameEn: new FormControl('', [Validators.required]),
      nameAr: new FormControl('', [Validators.required]),
      unitPrice: new FormControl('', [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]),
      taxType: new FormControl('AP', [Validators.required]),
      tax: new FormControl(0.00, [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]),
      specs: new FormControl(''),
      avatar: new FormControl(''),
      categoryId: new FormControl('', [Validators.required]),
      description: new FormControl(null,),
      deactivationDate: new FormControl(''),
    });
  }

  async findItem() {

    if (!this.fromNext) {
      this.activePage = 1;
    }

    let request = {
      method: "GET",
      path: "rest/item/search",
      body: null
    };

    let response = await this.httpService.httpRequest(request);
    console.log(response);
    if (response.status == 200) {
      this.itemList = response.data.pageList;
      let numberOfPages = response.data.numberOfPages;
      this.fillPageArray(numberOfPages);
    } else {
      this.fillPageArray(1);
      this.itemList = [];
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
    await this.findItem();
    console.log("+this.activePage+", this.activePage);
  }

  markFormGroupToched(){
    (<any>Object).values(this.itemForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  async save(){
    this.markFormGroupToched();

    console.log(this.itemForm.valid);

    if (this.itemForm.valid) {

      let request = {
        method: "POST",
        path: "rest/item/create",
        body: this.itemForm.value
      };

      let response = await this.httpService.httpRequest(request);
      console.log(response);
      if(response.status == 200){

        this.notifyService.addToast({ title: "Success", msg: "Item Added Successfully", timeout: 10000, theme: '', position: 'top-center', type: 'success' });
      
      
        this.showTable=!this.showTable;

        this.itemForm.reset();

        await this.findItem();

      }else{
        this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      }
    }
  }

  async update(){
    this.markFormGroupToched();

    console.log(this.itemForm.valid);

    if (this.itemForm.valid) {

      let request = {
        method: "POST",
        path: "rest/item/update",
        body: this.itemForm.value
      };

      let response = await this.httpService.httpRequest(request);
      console.log(response);
      if(response.status == 200){

        this.notifyService.addToast({ title: "Success", msg: "Item Updated Successfully", timeout: 10000, theme: '', position: 'top-center', type: 'success' });
      
      
        this.showTable=!this.showTable;

        this.itemForm.reset();

        await this.findItem();

      }else{
        this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      }
    }
  }


  editItem(item){

    this.showTable=!this.showTable;

    this.editMode = true;

    this.itemForm.controls['itemId'].setValue(item.id);
    this.itemForm.controls['categoryId'].setValue(item.categoryId);
    this.itemForm.controls['nameEn'].setValue(item.nameEn);
    this.itemForm.controls['nameAr'].setValue(item.nameAr);
    this.itemForm.controls['avatar'].setValue(item.avatar);
    this.itemForm.controls['unitPrice'].setValue(item.unitPrice);
    this.itemForm.controls['description'].setValue(item.description);
    this.itemForm.controls['deactivationDate'].setValue(item.deactivationDate);
    this.itemForm.controls['taxType'].setValue(item.taxType);
    this.itemForm.controls['tax'].setValue(item.tax);
  }

  deleteItem(Item){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete Item!',
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
            path: "rest/item/delete?itemId="+Item.id,
            body: this.itemForm.value
          };
    
          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if(response.status == 200){
    
            Swal.fire(
              'Deleted!',
              'Your Item has been deleted.',
              'success'
            )
            await this.findItem();
    
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

  activeOrInactive(Item){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to change Item status!',
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
            path: "rest/item/activeInactive?itemId="+Item.id,
            body: this.itemForm.value
          };
    
          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if(response.status == 200){
    
            Swal.fire(
              'Changed!',
              'Your Item has been changed.',
              'success'
            )
            await this.findItem();
    
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

  taxTypeChange(event){
    console.log(event.target.value)
    switch(event.target.value){
      case 'NA': 
        this.itemForm.controls['tax'].disable();
        break;
      case 'EX': 
        this.itemForm.controls['tax'].disable();
        break;
      case 'AP': 
        this.itemForm.controls['tax'].enable();
        break;
    }
  }

  async uploadAttachment(file,controleName){
    console.log('fileL: ',file);

    let formData = new FormData(); 

    formData.append("file",file[0]);

    let request = {
      method: "POST",
      path: "file/upload",
      body: formData
    };

    let response = await this.httpService.httpRequest(request);
    if (response.status == 200) {
      this.itemForm.get(controleName).setValue(response.data.url)
    }
  }
}
