import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  menuHeader: any = [];
  private breadCrumb = new BehaviorSubject<any>(this.menuHeader);
  breadCrumb$ = this.breadCrumb.asObservable();
  changeBread(data) {
    this.breadCrumb.next(data);
  }

  constructor(private router: Router) {}


}
