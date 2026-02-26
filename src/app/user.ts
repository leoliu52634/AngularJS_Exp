import {Component, input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FormGroup, FormControl} from '@angular/forms';
import {ReactiveFormsModule, Validators} from '@angular/forms';
@Component({
  selector: 'app-user',
  template: ` 
  <br><hr style="border:5px solid red;">
  @if(isServerRunning){
    <div>Yes, the server is running</div>
  }@else{
     <div>No, the server is not running</div>
  }
  <br><hr>   

  @for (user of users; track user.id) {
      <p>{{ user.name }}</p>
   }
   <section (mouseover)="showMsg()">
      There's a secret message for you, hover to reveal:
      {{ msg }}
   </section>
  <br><hr>  

   <p>The user's name is {{ name() }}</p> 
   <p>Username: {{ ZXC }}</p>
     <br><hr>  

    <p>Preferred Framework:</p>
    <ul>
      <li>
        Static Image:
        <img ngSrc="/assets/logo.svg" alt="Angular logo" width="32" height="32" />
      </li>
      <li>
        Dynamic Image:
        <img [ngSrc]="logoUrl" [alt]="logoAlt" width="32" height="32" />
      </li>
    </ul>
      <br><hr>

    Username: {{ keyword }} 
    <p>{{ keyword }}'s favorite framework: {{ favoriteFramework }}</p>
    <label for="framework">
      Favorite Framework:
      <input id="framework" type="text" [(ngModel)]="favoriteFramework" />
    </label>
  <br><hr>  


    <form [formGroup]="profileForm" (ngSubmit)="handleSubmit()">
      <input type="text" formControlName="name" />
      <input type="email" formControlName="email" />
      <button type="submit">Submit</button>
    </form> 
    <h2>Profile Form</h2>
    <p>Name: {{ profileForm.value.name }}</p>
    <p>Email: {{ profileForm.value.email }}</p>
  <br><hr>  


    <form [formGroup]="profileForm2">
      <input type="text" formControlName="name2" name="name2" />
      <input type="email" formControlName="email2" name="email2" />
      <button type="submit" [disabled]="!profileForm2.valid">Submit</button>
    </form>
      <br><hr style="border:5px solid red;">
  `,
    imports: [NgOptimizedImage,FormsModule,ReactiveFormsModule],
})
export class User {  
  readonly name = input<string>();
   favoriteFramework = '';
   keyword = 'youngTech';
   ZXC = 'TEST user.ts';
   isServerRunning = true;
   users = [
    {id: 0, name: 'Sarah'},
    {id: 1, name: 'Amy'},
    {id: 2, name: 'Rachel'},
    {id: 3, name: 'Jessica'},
    {id: 4, name: 'Poornima'},
  ];

  msg='SUPER';
  showMsg(){
    this.msg = 'way to go!';
  }

  logoUrl = '/assets/logo.svg';
  logoAlt = 'Angular logo';

  profileForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
  });

  handleSubmit() {
    alert(this.profileForm.value.name + ' | ' + this.profileForm.value.email);
  }
  profileForm2 = new FormGroup({
    name2: new FormControl('', Validators.required),
    email2: new FormControl('', [Validators.required, Validators.email]),
  });
}
