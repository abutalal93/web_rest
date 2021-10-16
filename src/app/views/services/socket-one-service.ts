import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket;
  constructor() {   }

  setupCustomerSocketConnection(channelId) {
    this.socket = io("http://localhost:3000");

    this.socket.on('customer-'+channelId, (data: string) => {
      console.log(data);
    });
  }

  setupRestSocketConnection(channelId) {
    this.socket = io("http://localhost:3000");

    this.socket.on('rest-'+channelId, (data: string) => {
      console.log(data);
    });
  }

  sendMessage(channelId, message) {
    this.socket.emit(channelId, message);
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
