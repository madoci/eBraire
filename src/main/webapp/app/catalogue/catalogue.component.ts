import { HostListener, Component, OnInit } from '@angular/core';
import { WindowRef } from './window/window.component';

@Component({
  selector: 'jhi-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss'],
})
export class CatalogueComponent implements OnInit {
  deployed = false;
  width = 0;
  window: Window;

  constructor(public winRef: WindowRef) {
    this.width = winRef.nativeWindow.innerWidth;
    this.window = winRef.nativeWindow;
  }

  ngOnInit(): void {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.width = event.target.innerWidth;
  }

  btnClic(): void {
    this.deployed = !this.deployed;
  }
}
