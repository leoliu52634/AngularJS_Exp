import { Component, signal ,PLATFORM_ID, inject, computed, effect, linkedSignal, resource, model, ChangeDetectionStrategy} from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import { LowerCasePipe,DecimalPipe,DatePipe,CurrencyPipe,isPlatformBrowser} from '@angular/common';
import { email, form, FormField, required ,submit} from '@angular/forms/signals';
import { ChildComponent } from './child'; // 1. 【路徑關聯】先找到檔案
import { ReversePipe } from './reverse.pipe';
import { CarService } from './car.service';
import { User } from './user';
import { Comments } from './comments';
import { loadUser } from './user-api';
import { CustomCheckbox } from './custom-checkbox';
import {CartStore} from './cart-store';
import {CartDisplay} from './cart-display';
import {HighlightDirective} from './highlight-directive';
import {ArticleComments} from './article-comments';
import { single } from 'rxjs';
//Use Angular v21 
interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink,ChildComponent,LowerCasePipe,
    DecimalPipe,DatePipe,CurrencyPipe,ReversePipe,User,Comments,
    CustomCheckbox,CartDisplay,HighlightDirective,
    FormField,ArticleComments],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('my-app');
  a ='我來了~';

  username='yOunGTECh';num = 103.1234;
  birthday = new Date(2023, 3, 2);cost = 4560.34;word = "Are You"

  // 加上這行，HTML 的報錯就會消失！
  protected readonly wallet = signal(1500); 
  // 還有，別忘了 HTML 裡也有用到 (shout)="handleChild($event)"
  // 所以也要加上這個方法：
  handleChild(msg: string) {
    console.log('收到訊息：', msg);
  }
  carService = inject(CarService);
  display = this.carService.getCars().join(' ⭐️ ');

  items = new Array();
  addItem(item: string) {
    this.items.push(item);
  }

  userStatus = signal<'online' | 'away' | 'offline'>('offline');
  // Now using linkedSignal instead of computed - writable!
  notificationsEnabled = linkedSignal(() => this.userStatus() === 'online');

  statusMessage = computed(() => {
    const status = this.userStatus();
    switch (status) {
      case 'online':
        return 'Available for meetings and messages';
      case 'away':
        return 'Temporarily away, will respond soon';
      case 'offline':
        return 'Not available, check back later';
      default:
        return 'Status unknown';
    }
  });

  isWithinWorkingHours = computed(() => {
    const now = new Date();
    const hour = now.getHours();
    const isWeekday = now.getDay() > 0 && now.getDay() < 6;
    return isWeekday && hour >= 9 && hour < 17 && this.userStatus() !== 'offline';
  });
  toggleNotifications() {
    // This works with linkedSignal but would error with computed!
    this.notificationsEnabled.set(!this.notificationsEnabled());
  }
  goOnline() {
    this.userStatus.set('online');
  }
  goAway() {
    this.userStatus.set('away');
  }
  goOffline() {
    this.userStatus.set('offline');
  }
  toggleStatus() {
    const current = this.userStatus();
    switch (current) {
      case 'offline':
        this.userStatus.set('online');
        break;
      case 'online':
        this.userStatus.set('away');
        break;
      case 'away':
        this.userStatus.set('offline');
        break;
    }
  }

  userId=signal(1);
  userResource = resource({
    params: () => ({id: this.userId()}),
    loader: (params) => loadUser(params.params.id),
  });

  isLoading = computed(() => this.userResource.status() === 'loading');
  hasError = computed(() => this.userResource.status() === 'error');

  loadUser(id: number) {
    this.userId.set(id);
  }

  reloadUser() {
    this.userResource.reload();
  }

  // Parent signal models
  agreedToTerms = model(false);
  enableNotifications = model(true);
  // Methods to test two-way binding
  toggleTermsFromParent() {
    this.agreedToTerms.set(!this.agreedToTerms());
  }
  resetAll() {
    this.agreedToTerms.set(false);
    this.enableNotifications.set(false);
  }
  cartStore = inject(CartStore);


  //注入平台 ID (這會告訴我們目前在哪)
  private platformId = inject(PLATFORM_ID);
  theme = signal<'light'|'dark'>('light');
  Guest = signal('Guest');
  isLoggedIn = signal(false);
  themeClass = computed(() => `theme-${this.theme()}`);
  constructor() {
    //computed(計算) 會回傳一個新的 Signal。產生「衍生資料」。極懶。沒人讀取它時，它根本不計算。不能在裡面修改其他 Signal。有快取。算過一次，資料沒變就不重算。
    //effect(副作用) 不會回傳任何東西。執行「外部影響」(如存檔、Log、API)。主動。只要依賴的 Signal 變了，它就跑。預設禁止修改 Signal（除非特殊設定）。無快取。它是動作，每次變動都執行。
    // Save theme to localStorage whenever it changes
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('theme', this.theme());
        //console.log('Theme saved to localStorage:', this.theme());
      }
    });
    // Log user activity changes
    effect(() => {
      const status = this.isLoggedIn() ? 'logged in' : 'logged out';
      const user = this.Guest();
      //console.log(`User ${user} is ${status}`);
    });

    // Timer effect with cleanup
    effect((onCleanup) => {
      const interval = setInterval(() => {
        //console.log('Timer tick - Current theme:', this.theme());
      }, 5000);

      // Clean up the interval when the effect is destroyed
      onCleanup(() => {
        clearInterval(interval);
        //console.log('Timer cleaned up');
      });
    });
  }
  toggleTheme() {
    this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
  }
  login() {
    this.Guest.set('John Doe');
    this.isLoggedIn.set(true);
  }
  logout() {
    this.Guest.set('Guest');
    this.isLoggedIn.set(false);
  }

  //Add validation and submission to your form
  loginModel = signal<LoginData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  loginForm = form(this.loginModel, (fieldPath) => {
    required(fieldPath.email, {message: 'Email is required'});
    email(fieldPath.email, {message: 'Enter a valid email address'});
    required(fieldPath.password, {message: 'Password is required'});
  });

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.loginForm, async () => {
      const credentials = this.loginModel();
      //console.log('Logging in with:', credentials);
      // Add your login logic here
    });
  }


}
