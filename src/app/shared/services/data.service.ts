import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  private breadCrumb = new BehaviorSubject<any>(null);
  breadCrumb$ = this.breadCrumb.asObservable();
  changeBread(data) {
    this.breadCrumb.next(data);
    localStorage.setItem('breadCrumb', JSON.stringify(data));
  }

  private event = new BehaviorSubject<any>(null);
  event$ = this.event.asObservable();
  changeEvent(data) {
    this.event.next(data);
    localStorage.setItem('event', JSON.stringify(data));
  }

  private eventDeatils = new BehaviorSubject<any>(null);
  eventDeatils$ = this.eventDeatils.asObservable();
  changeEventDetails(data) {
    this.eventDeatils.next(data);
    localStorage.setItem('eventDeatils', JSON.stringify(data));
  }

  private matchOdds = new BehaviorSubject<any>(null);
  matchOdds$ = this.matchOdds.asObservable();
  changeMatchOdds(data) {
    this.matchOdds.next(data);
  }

  private bookMaker = new BehaviorSubject<any>(null);
  bookMaker$ = this.bookMaker.asObservable();
  changeBookMaker(data) {
    this.matchOdds.next(data);
  }

  private settingData = new BehaviorSubject<any>(null);
  settingData$ = this.settingData.asObservable();
  changeSettingData(data) {
    this.settingData.next(data);
  }

  private balanceInfo = new BehaviorSubject<any>(null);
  balanceInfo$ = this.balanceInfo.asObservable();
  changeBalanceInfo(data) {
    this.balanceInfo.next(data);
  }

  constructor(private router: Router) {
    this.event.next(JSON.parse(localStorage.getItem('event')));
    this.breadCrumb.next(JSON.parse(localStorage.getItem('breadCrumb')));
    this.eventDeatils.next(JSON.parse(localStorage.getItem('eventDeatils')));
  }


}
