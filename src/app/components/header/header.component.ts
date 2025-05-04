import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import * as ScrollMagic from 'scrollmagic';
import { gsap } from 'gsap';
import {Scene} from 'scrollmagic';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [
    NgIf,
    NgClass,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnChanges{
  @Input() isMapPage = false;

  private controller: ScrollMagic.Controller;
  public updated = false;
  private timeoutId: any;
  public logoSrc: string = 'assets/media/logo/blue-logo-white-bold-text.svg';


  constructor() {
    this.controller = new ScrollMagic.Controller();
  }


  ngOnInit() {
    // @ts-ignore
    const scene = new ScrollMagic.Scene({
      triggerHook: 0,
      offset: 100 // на 100px від верху
    })
      .on('enter', () => {
        gsap.to('#header', { opacity: 0, duration: 0.3 });

        // Скасовуємо попередній таймер (на всяк випадок)
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }

        // Ставимо новий таймер
        this.timeoutId = setTimeout(() => {
          this.updated = true;
          this.logoSrc = 'assets/media/logo/grey-logo-white-text.svg';
          gsap.to('#header', { opacity: 1, duration: 0.5 });
        }, 1000);
      })
      .on("enter", (event: any) => {  // <--- перехоплюємо тип any
        if (event.scrollDirection === 'REVERSE') {
          // Якщо скролимо назад вгору
          gsap.to('#header', { opacity: 0, duration: 1 });

          if (this.timeoutId) {
            clearTimeout(this.timeoutId); // скасувати таймер оновлення, якщо ще не оновили
          }

          this.updated = false;
          this.logoSrc = 'assets/media/logo/grey-logo-white-text.svg';
          setTimeout(() => {
            gsap.to('#header', { opacity: 1, duration: 1 });
          }, 50); // легка затримка для плавності
        }
      })
      .addIndicators({ name: "Header Trigger" }) // видно на екрані де тригер
      .addTo(this.controller);

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isMapPage']) {
      if (this.isMapPage || this.updated) {
        this.logoSrc = 'assets/media/logo/grey-logo-white-text.svg';
      }
    }
  }
}
