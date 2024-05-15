import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  registerMode = false;
  users: any;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsers();
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }
  getUsers() {
    this.http.get('https://localhost:5001/api/users').subscribe({
      // this is what you wanna do with the call you have to pass it a function
      next: (response) => (this.users = response),
      error: (error) => console.log(error),
      complete: () => console.log('request has completed'),
    });
  }

  cancelRegisterMode(event: boolean){
    this.registerMode = event
  }
}
