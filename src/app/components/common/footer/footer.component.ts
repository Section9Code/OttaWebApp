import { Component } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'footer',
  templateUrl: 'footer.template.html'
})
export class FooterComponent { 
  version: string = environment.version;
}
