import { Component } from '@angular/core';

@Component({
  selector: 'app-main-home',
  templateUrl: './main-home.component.html',
  styleUrls: ['./main-home.component.scss']
})
export class MainHomeComponent {

  selectedIndex = 0;

  buttons = [
    { label: 'Product', image: 'assets/startups.png' },
    { label: 'Softwar', image: 'assets/bullet.png' },
    { label: 'Engineering', image: 'assets/setting.png' },
    { label: 'Design', image: 'assets/setting.png' },
    { label: 'Marketing', image: 'assets/bullet.png' },
    { label: 'StartUp', image: 'assets/startups.png' }
  ];

  changeImage(index: number) {
    this.selectedIndex = index;
  }
}
