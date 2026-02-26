import {Component} from '@angular/core';

@Component({
  selector: 'app-user',
  template: ` <div>The username in user/user.ts: {{ username }}</div> `,
})
export class User {
  username = 'The username in user/user.ts ';
}
