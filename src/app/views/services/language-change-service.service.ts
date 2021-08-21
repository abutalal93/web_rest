import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class LanguageChangeService {
    public direction_layout : string = 'right';
    private direction : string = 'rtl';
    private vertical_placement : String;
    private class_tabs : string = "md-right-tabs";

    constructor(public translate: TranslateService,
         private cookieService: CookieService) {
    }
    init_app_lang(): void{
        let lang = (this.cookieService.check('lng')) ? this.cookieService.get('lng') : 'ar';
        this.do_changes(lang);
    }
    change_app_lang(): void{
        let lang = (this.cookieService.get('lng') == 'en') ? 'ar' : 'en';
        this.do_changes(lang);
    }
    do_changes(lang){
        this.set_translate_lang(lang);
        this.set_lang_cookie(lang);
        this.set_app_directions();
    }
    set_translate_lang(lang: string): void {
        this.translate.use(lang);
    }
    set_lang_cookie(lang: string): void {
        this.cookieService.set( 'lng', lang );
    }
    set_app_directions(): void {
        this.direction = (this.cookieService.get('lng') == "en") ? "ltr" : "rtl";
        this.direction_layout = (this.cookieService.get('lng') == "ar") ? "right" : "left";

    }
    get_app_direction(): string {
        return this.direction;
     }
     get_app_direction_layout(): string {
        return this.direction_layout;
     }

     getTranslate(key: string): string {
       let value: string;
       this.translate.get(key).subscribe(res => {
         value = res;
       });
       return value;
     }
}
