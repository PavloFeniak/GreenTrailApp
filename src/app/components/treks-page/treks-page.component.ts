import {Component, OnInit} from '@angular/core';
import $ from 'jquery';
import {TrekPreviewComponent} from '../trek-preview/trek-preview.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-treks-page',
  imports: [
    TrekPreviewComponent,
    NgForOf
  ],
  templateUrl: './treks-page.component.html',
  styleUrl: './treks-page.component.css'
})
export class TreksPageComponent implements OnInit {
  treks = Array(6);
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

      $el.addClass('zoom-out-bg');
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
          // 'background-size': 'cover',
          'background-attachment': 'fixed'
        });
      }
    });
  }

}
