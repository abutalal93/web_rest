import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInOutTranslate } from '../animations/animation';
import { HttpService } from '../services/http.service';
import { NotifyService } from '../services/notify.service';
import Swal from 'sweetalert2'

@Component({
  templateUrl: 'setting.component.html',
  animations: [fadeInOutTranslate]
})
export class SettingComponent implements OnInit {



  async ngOnInit() {

  }

  constructor(private httpService: HttpService, private notifyService: NotifyService) {

  }


  loadForm() {

  }
}
