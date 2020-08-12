import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  constructor() {
    this.socket = io(environment.sererUrl + ":8001");

    this.socket.on('getBalanceResponse', (data) => {
      console.log("getBalanceResponse==", data);
    })
  }

  connectSocket(data) {
    this.socket.emit('online', data);
  }

  getBalance(data) {
    this.socket.emit('getBalance', data);
  }


}
