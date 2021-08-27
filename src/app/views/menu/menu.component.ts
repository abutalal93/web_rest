import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInOutTranslate } from '../animations/animation';
import { HttpService } from '../services/http.service';
import { NotifyService } from '../services/notify.service';
import Swal from 'sweetalert2'

@Component({
  templateUrl: 'menu.component.html',
  animations: [fadeInOutTranslate]
})
export class MenuComponent implements OnInit {



  categoryList = [];

  page = 0;
  activePage = 1;
  pages = [];
  pageSize = 10;
  fromNext = false;
  
  showTable = true;

  categoryForm: FormGroup;

  editMode = false;

  async ngOnInit() {
    this.loadForm();
    await this.findCategory();
  }

  constructor(private httpService: HttpService, private notifyService: NotifyService) {

  }

  loadForm() {
    this.categoryForm = new FormGroup({
      categoryId: new FormControl(''),
      nameEn: new FormControl('', [Validators.required]),
      nameAr: new FormControl('', [Validators.required]),
      avatar: new FormControl(''),
    });
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
    await this.findCategory();
    console.log("+this.activePage+", this.activePage);
  }

  markFormGroupToched(){
    (<any>Object).values(this.categoryForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  async save(){

    this.markFormGroupToched();

    if (this.categoryForm.valid) {

      let request = {
        method: "POST",
        path: "rest/category/create",
        body: this.categoryForm.value
      };

      let response = await this.httpService.httpRequest(request);
      console.log(response);
      if(response.status == 200){

        this.notifyService.addToast({ title: "Success", msg: "Operation Done Successfully", timeout: 10000, theme: '', position: 'top-center', type: 'success' });
      
      
        this.showTable=!this.showTable;

        this.categoryForm.reset();

        await this.findCategory();

      }else{
        this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      }
    }
  }

  async update(){

    this.markFormGroupToched();

    if (this.categoryForm.valid) {

      let request = {
        method: "POST",
        path: "rest/category/update",
        body: this.categoryForm.value
      };

      let response = await this.httpService.httpRequest(request);
      console.log(response);
      if(response.status == 200){

        this.notifyService.addToast({ title: "Success", msg: "Operation Done Successfully", timeout: 10000, theme: '', position: 'top-center', type: 'success' });
      
      
        this.showTable=!this.showTable;

        this.categoryForm.reset();

        await this.findCategory();

      }else{
        this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      }
    }
  }


  editQr(category){

    this.showTable=!this.showTable;

    this.editMode = true;

    this.categoryForm.controls['categoryId'].setValue(category.id);
    this.categoryForm.controls['nameEn'].setValue(category.nameEn);
    this.categoryForm.controls['nameAr'].setValue(category.nameEn);
    this.categoryForm.controls['avatar'].setValue(category.avatar);
  }

  deleteQr(Category){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete Category code!',
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
            path: "rest/category/delete?categoryId="+Category.id,
            body: this.categoryForm.value
          };
    
          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if(response.status == 200){
    
            Swal.fire(
              'Deleted!',
              'Your Category has been deleted.',
              'success'
            )
            await this.findCategory();
    
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
          'Your Category is safe :)',
          'error'
        )
      }
    });
  }

  activeOrInactive(Category){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to change Category status!',
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
            path: "rest/category/activeInactive?categoryId="+Category.id,
            body: this.categoryForm.value
          };
    
          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if(response.status == 200){
    
            Swal.fire(
              'Changed!',
              'Your Category has been changed.',
              'success'
            )
            await this.findCategory();
    
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
          'Your Category is safe :)',
          'error'
        )
      }
    });
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
      this.categoryForm.get(controleName).setValue(response.data.url)
    }
  }
}
