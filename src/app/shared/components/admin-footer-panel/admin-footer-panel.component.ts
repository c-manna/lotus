import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '@env/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-footer-panel',
  templateUrl: './admin-footer-panel.component.html',
  styleUrls: ['./admin-footer-panel.component.scss']
})
export class AdminFooterPanelComponent implements OnInit {
  public copyright_date: any;
  public copyright_text: any;
  subscription: Subscription;
  currentLang:any;
  availableLangs:any=[];
  selectedLanguage = '';

  constructor(@Inject(DOCUMENT) private document: Document ) {
  }

  ngOnInit() {
    this.document.body.classList.remove('dashboard-bg');
    this.copyright_date = new Date();
    //this.copyright_text = environment.FooterCopyright.replace("[YYYY]", this.copyright_date.getFullYear());
  }
}
