import { Component, OnInit } from '@angular/core';
import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit{
  socket: Socket;
  msg = "";
  input = "";
  messages: any = [];
  notifications: any = [];
  roomA: any = [];
  roomB: any = [];

  constructor() {
    this.socket = io('ws://localhost:3000');
  }

  public send() {
    console.log(this.input);
    this.socket.emit('message', this.input);
  }

  public newMessage() {
    this.socket.on('message', (msg: any) => {
      console.log(msg);
      this.messages.push(msg);
    });

    this.socket.on('notifications', (msg: any) => {
      console.log(msg);
      this.notifications.push(msg);
    });

    this.socket.on('room-A-received', (msg: any) => {
      console.log(msg);
      this.roomA.push(msg);
    });
    this.socket.on('room-B-received', (msg: any) => {
      console.log(msg);
      this.roomB.push(msg);
    });
  }

  public ngOnInit(): void {
    this.newMessage();
  }

  public sendNotification() {
    console.log(this.input);
    this.socket.emit('notifications', [this.input]);
  }

  public sendRoomA() {
    console.log(this.input);
    this.socket.emit('room', this.input, 'roomA');
  }

  public sendRoomB() {
    console.log(this.input);
    this.socket.emit('room', this.input, 'roomB');
  }

  public joinRoomA() {
    this.socket.emit('join-room', 'roomA');
  }

  public joinRoomB() {
    this.socket.emit('join-room', 'roomB');
  }

  public disconnectBE() {
    this.socket.emit('disconnect');
  }

  public disconnectFE() {
    this.socket.close();
  }

  public connectFE() {
    this.socket.open();
  }
}
