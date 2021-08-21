import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInOutTranslate } from '../animations/animation';
import { HttpService } from '../services/http.service';
import { NotifyService } from '../services/notify.service';
import Swal from 'sweetalert2'

@Component({
  templateUrl: 'qrs.component.html',
  animations: [fadeInOutTranslate]
})
export class QrsComponent implements OnInit {



  qrsList = [];

  page = 0;
  activePage = 1;
  pages = [];
  pageSize = 10;
  fromNext = false;
  
  showTable = true;

  qrForm: FormGroup;

  async ngOnInit() {
    this.loadForm();
    await this.findQrs();
  }

  constructor(private httpService: HttpService, private notifyService: NotifyService) {

  }


  loadForm() {
    this.qrForm = new FormGroup({
      alias: new FormControl('', [Validators.required])
    });
  }

  async findQrs() {

    if (!this.fromNext) {
      this.activePage = 1;
    }

    let request = {
      method: "GET",
      path: "rest/qr/search",
      body: null
    };

    let response = await this.httpService.httpRequest(request);
    console.log(response);
    if (response.status == 200) {
      this.qrsList = response.data.pageList;
      let numberOfPages = response.data.numberOfPages;
      this.fillPageArray(numberOfPages);
    } else {
      this.fillPageArray(1);
      this.qrsList = [];
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
    await this.findQrs();
    console.log("+this.activePage+", this.activePage);
  }


  async save(){
    this.httpService.markFormGroupTouched(this.qrForm);

    if (this.qrForm.valid) {

      let request = {
        method: "POST",
        path: "rest/qr/create",
        body: this.qrForm.value
      };

      let response = await this.httpService.httpRequest(request);
      console.log(response);
      if(response.status == 200){

        this.notifyService.addToast({ title: "Success", msg: "Operation Done Successfully", timeout: 10000, theme: '', position: 'top-center', type: 'success' });
      
      
        this.showTable=!this.showTable;

        this.qrForm.reset();

        await this.findQrs();

      }else{
        this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      }
    }
  }


  editQr(qr){

    this.showTable=!this.showTable;

    this.qrForm.controls['alias'].setValue(qr.alias);

  }

  deleteQr(qr){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete QR code!',
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
            path: "rest/qr/delete?qrId="+qr.id,
            body: this.qrForm.value
          };
    
          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if(response.status == 200){
    
            Swal.fire(
              'Deleted!',
              'Your QR has been deleted.',
              'success'
            )
            await this.findQrs();
    
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
          'Your QR is safe :)',
          'error'
        )
      }
    });
  }

  activeOrInactive(qr){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to change QR status!',
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
            path: "rest/qr/activeInactive?qrId="+qr.id,
            body: this.qrForm.value
          };
    
          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if(response.status == 200){
    
            Swal.fire(
              'Changed!',
              'Your QR has been changed.',
              'success'
            )
            await this.findQrs();
    
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
          'Your QR is safe :)',
          'error'
        )
      }
    });
  }
}