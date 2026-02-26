import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-child', // 【標籤名】父組件 HTML 裡要寫 <app-child>
  standalone: true,// 現代 Angular 必加
  template: `
    <div style="border: 1px bioled; padding: 10px;">
      <p>收到父組件的錢：{{ money() }}</p> <button (click)="callParent()">回報給父組件</button>
    </div>
    <button class="btn" (click)="addItem()">Add Item</button>
  `
})
export class ChildComponent {
  // --------------------------------------------------
  // A. 【插座】(Input): 讓資料「流進來」
  // 相當於 React 的 props.money
  // --------------------------------------------------
  money = input<number>(0); 

  // --------------------------------------------------
  // B. 【廣播器】(Output): 讓事件「傳出去」
  // 相當於 React 傳進來的 callback function
  // --------------------------------------------------
  shout = output<string>(); 

  callParent() {
    this.shout.emit('任務完成！'); // 真正「發射」訊號的動作
  }

  readonly addItemEvent = output<string>();
  addItem() {
    this.addItemEvent.emit('🐢');
  }

}