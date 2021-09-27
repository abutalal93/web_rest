import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInOutTranslate } from '../animations/animation';
import { HttpService } from '../services/http.service';
import { NotifyService } from '../services/notify.service';
import Swal from 'sweetalert2'
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  templateUrl: 'setting.component.html',
  animations: [fadeInOutTranslate]
})
export class SettingComponent implements OnInit {


  settingForm: FormGroup;

  specsList = [];

  counter: number = 0;

  detailedCounter: number = 0;

  selectedSpecs = null;

  selectedDetailed = null;

  async ngOnInit() {
    this.loadForm();
    await this.findSetting();
  }

  detailInfo = {
    nameEn: null,
    nameAr: null,
    unitPrice: null
  }

  @ViewChild('myModal') public myModal: ModalDirective;

  constructor(private httpService: HttpService, private notifyService: NotifyService) {

  }


  loadForm() {
    this.settingForm = new FormGroup({
      id: new FormControl(''),
      brandNameEn: new FormControl('', [Validators.required]),
      brandNameAr: new FormControl('', [Validators.required]),
      logo: new FormControl(''),
      specsList: new FormControl(''),
      nameEn: new FormControl(''),
      nameAr: new FormControl(''),
      unitPrice: new FormControl(''),
      serviceFees: new FormControl(''),
    });
  }

  async findSetting() {


    let request = {
      method: "GET",
      path: "rest/setting",
      body: null
    };

    let response = await this.httpService.httpRequest(request);
    console.log(response);
    if (response.status == 200) {

      let data = response.data;

      this.settingForm.controls['id'].setValue(data.id);
      this.settingForm.controls['brandNameEn'].setValue(data.brandNameEn);
      this.settingForm.controls['brandNameAr'].setValue(data.brandNameAr);
      this.settingForm.controls['logo'].setValue(data.logo);

      this.counter = (data.specsList) ? (data.specsList.length): (0);

      this.addSpecsList(data.specsList);
    }
  }

  addSpecs(){
    console.log('addSpecs: ')
    this.counter = this.counter + 1;
    let specs = {
      counter: this.counter,
      alias: null,
      detailList: []
    }

    this.settingForm.addControl('alias' + specs.counter, new FormControl(specs.alias, Validators.required));
    this.specsList.push(specs);
  }

  addSpecsList(specsList){


    specsList.forEach(currentSpecs => {

      this.counter = this.counter + 1;
      let specs = {
        id: currentSpecs.id,
        counter: this.counter,
        alias: currentSpecs.alias,
        detailList: currentSpecs.detailList
      }
  
      this.settingForm.addControl('alias' + specs.counter, new FormControl(specs.alias, Validators.required));
      this.specsList.push(specs);
    });
  }

  setAlias(currentSpecs) {
    let specsIndex = this.specsList.findIndex(specs => specs.counter === currentSpecs.counter);
    this.specsList[specsIndex].alias = this.settingForm.get('alias' + currentSpecs.counter).value;
  }

  openDialog(specs){
    this.myModal.show();
    this.selectedSpecs = specs;
  }

  addDetail(){

    if(this.selectedDetailed != null){

      let detail = {
        id: this.selectedDetailed.id,
        nameEn: this.settingForm.controls['nameEn'].value,
        nameAr: this.settingForm.controls['nameAr'].value,
        unitPrice: this.settingForm.controls['unitPrice'].value
      }
  
      let detailedIndex = this.selectedSpecs.detailList.findIndex(detail => detail.id === this.selectedDetailed.id);
      this.selectedSpecs.detailList[detailedIndex] = detail;

    }else{
      this.detailedCounter = this.detailedCounter + 1;
      let detail = {
        id: this.detailedCounter,
        nameEn: this.settingForm.controls['nameEn'].value,
        nameAr: this.settingForm.controls['nameAr'].value,
        unitPrice: this.settingForm.controls['unitPrice'].value
      }
  
      this.selectedSpecs.detailList.push(detail);
    }


    this.settingForm.controls['nameEn'].reset();
    this.settingForm.controls['nameAr'].reset();
    this.settingForm.controls['unitPrice'].reset();

    this.myModal.hide();

    this.selectedSpecs = null;
    this.selectedDetailed = null;
  }

  delete(specs,detail){
    specs.detailList = specs.detailList.filter(currentItem => currentItem.id !== detail.id);
  }

  edit(specs,detail){
    this.selectedSpecs = specs;
    this.selectedDetailed = detail;

    this.settingForm.controls['nameEn'].setValue(detail.nameEn);
    this.settingForm.controls['nameAr'].setValue(detail.nameAr);
    this.settingForm.controls['unitPrice'].setValue(detail.unitPrice);

    this.myModal.show();
  }

  async save(){
    let request = {
      method: "POST",
      path: "rest/setting",
      body: this.settingForm.value
    };

    request.body.specsList = this.specsList;

    let response = await this.httpService.httpRequest(request);
    console.log(response);
    if (response.status == 200) {

      this.notifyService.addToast({ title: "Success", msg: "Setting updated successfully: " + response.data, timeout: 10000, theme: '', position: 'top-center', type: 'success' });
    } else {
      this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
    }
  }

  closeModal(){
    this.myModal.hide();
    this.selectedSpecs = null;
    this.selectedDetailed = null;
  }

}
