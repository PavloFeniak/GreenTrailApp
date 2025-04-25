import {Component, OnInit} from '@angular/core';
import $ from 'jquery';
import 'animate.css'


@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  ngOnInit(): void {
    $(document).ready(() => {
      this.initParallaxImages();
    });
  }

  initParallaxImages(): void {
    $('[data-parallax="scroll"]').each(function () {
      const $el = $(this);
      const imageSrc = $el.attr('data-image-src');
      const bleed = $el.attr('data-bleed') || '0';
      const positionY = $el.attr('data-position') || 'center';

      // Якщо є плагін $.fn.parallax — ініціалізуємо його
      if (typeof ($el as any).parallax === 'function') {
        ($el as any).parallax({
          imageSrc: imageSrc,
          bleed: parseInt(bleed),
          positionY: positionY
        });
      } else {
        // Fallback: задаємо background-image вручну
        $el.css({
          'background-image': `url(${imageSrc})`,
          'background-position': positionY,
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
          'background-attachment': 'fixed'
        });
      }
    });
  }
}
