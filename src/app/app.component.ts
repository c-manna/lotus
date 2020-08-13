import { Component, OnInit } from '@angular/core';
import { SocketService } from '@app/shared/services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lotus';

  // constructor(private _socketService: SocketService) { }

  ngOnInit() {
    let userId = "2750231N007";
    // this._socketService.connectSocket(userId);
  }
}
