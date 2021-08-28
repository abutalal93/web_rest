import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInOutTranslate } from '../animations/animation';
import { HttpService } from '../services/http.service';
import { NotifyService } from '../services/notify.service';
import Swal from 'sweetalert2'
import { CustomValidationService } from '../services/custom-validation-service.service';
import { User } from '../model/user';
import { AuthService } from '../services/auth-service.service';

@Component({
  templateUrl: 'user.component.html',
  animations: [fadeInOutTranslate]
})
export class UserComponent implements OnInit {


  userList = [];

  page = 0;
  activePage = 1;
  pages = [];
  pageSize = 10;
  fromNext = false;
  
  showTable = true;

  userForm: FormGroup;

  editMode = false;

  user: User;

  async ngOnInit() {
    this.user = this.authService.getLoggedInUser();
    this.loadForm();
    await this.findUser();
  }

  constructor(private httpService: HttpService, private notifyService: NotifyService, private customValidationService: CustomValidationService,public authService: AuthService) {

  }


  loadForm() {
    this.userForm = new FormGroup({
      userId: new FormControl(''),
      firstName: new FormControl('', [Validators.required]),
      secondName: new FormControl(''),
      thirdName: new FormControl(''),
      lastName: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required,Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{4,15}$/)]),
      confirmPassword: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required,Validators.email]),
      mobileNumber: new FormControl('',[Validators.required,Validators.pattern(/^[0][0-9]{9}/)])
    });

    this.userForm.controls['confirmPassword'].setValidators(this.customValidationService.equalTo(this.userForm.controls['password']));
    this.userForm.updateValueAndValidity();
  }


  ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }

  async findUser() {

    if (!this.fromNext) {
      this.activePage = 1;
    }

    let request = {
      method: "GET",
      path: "rest/user/search",
      body: null
    };

    let response = await this.httpService.httpRequest(request);
    console.log(response);
    if (response.status == 200) {
      this.userList = response.data.pageList;
      let numberOfPages = response.data.numberOfPages;
      this.fillPageArray(numberOfPages);
    } else {
      this.fillPageArray(1);
      this.userList = [];
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
    await this.findUser();
    console.log("+this.activePage+", this.activePage);
  }

  markFormGroupToched(){
    (<any>Object).values(this.userForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  async save(){
    this.markFormGroupToched();

    console.log(this.userForm.valid);

    console.log(this.userForm);

    if (this.userForm.valid) {

      let request = {
        method: "POST",
        path: "rest/user/add",
        body: this.userForm.value
      };

      let response = await this.httpService.httpRequest(request);
      console.log(response);
      if(response.status == 200){

        this.notifyService.addToast({ title: "Success", msg: "Operation Done Successfully", timeout: 10000, theme: '', position: 'top-center', type: 'success' });
      
      
        this.showTable=!this.showTable;

        this.userForm.reset();

        await this.findUser();

      }else{
        this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      }
    }
  }

  async update(){
    this.markFormGroupToched();

    console.log(this.userForm.valid);

    console.log(this.userForm);

    if (this.userForm.valid) {

      let request = {
        method: "POST",
        path: "rest/user/update",
        body: this.userForm.value
      };

      let response = await this.httpService.httpRequest(request);
      console.log(response);
      if(response.status == 200){

        this.notifyService.addToast({ title: "Success", msg: "Operation Done Successfully", timeout: 10000, theme: '', position: 'top-center', type: 'success' });
      
      
        this.showTable=!this.showTable;

        this.userForm.reset();

        await this.findUser();

      }else{
        this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      }
    }
  }


  editUser(user){

    this.showTable=!this.showTable;

    this.editMode = true;

    this.userForm.controls['userId'].setValue(user.id);
    this.userForm.controls['firstName'].setValue(user.firstName);
    this.userForm.controls['secondName'].setValue(user.secondName);
    this.userForm.controls['thirdName'].setValue(user.thirdName);
    this.userForm.controls['lastName'].setValue(user.lastName);
    this.userForm.controls['username'].setValue(user.username);
    this.userForm.controls['email'].setValue(user.email);
    this.userForm.controls['mobileNumber'].setValue(user.mobileNumber);
    this.userForm.controls['password'].setValue('Yewx44bn$');
    this.userForm.controls['confirmPassword'].setValue('Yewx44bn$');
  }

  deleteUser(User){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete User code!',
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
            path: "rest/user/delete?userId="+User.id,
            body: this.userForm.value
          };
    
          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if(response.status == 200){
    
            Swal.fire(
              'Deleted!',
              'Your User has been deleted.',
              'success'
            )
            await this.findUser();
    
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
          'Your User is safe :)',
          'error'
        )
      }
    });
  }

  activeOrInactive(User){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to change User status!',
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
            path: "rest/user/activeInactive?userId="+User.id,
            body: this.userForm.value
          };
    
          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if(response.status == 200){
    
            Swal.fire(
              'Changed!',
              'Your User has been changed.',
              'success'
            )
            await this.findUser();
    
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
          'Your User is safe :)',
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
      this.userForm.get(controleName).setValue(response.data.url)
    }
  }
}
