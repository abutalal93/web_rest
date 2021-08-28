import { Component, OnInit } from '@angular/core';
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


  qrInfo = null

  isLoaded = false;


  constructor(private activatedRoute: ActivatedRoute, private cookieService: CookieService, private httpService: HttpService, private notifyService: NotifyService) { }

  async ngOnInit() {

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

      this.qrInfo = response.data

    }else{
      this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
    }
  }

  viewItem(category){
    console.log
  }

}
