import {AfterViewInit, Component, OnInit} from '@angular/core';
import $ from 'jquery';
import 'animate.css';
import * as L from 'leaflet';
import {NgForOf} from '@angular/common';
import {TrekPreviewComponent} from '../trek-preview/trek-preview.component';
import {RouterLink} from '@angular/router';

declare var SMap: any;

@Component({
  selector: 'app-home-page',
  imports: [
    NgForOf,
    TrekPreviewComponent,
    RouterLink
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit, AfterViewInit  {
  private map: L.Map | undefined;
  private readonly API_KEY = 'HFo20yrq4X8ulf_mMAW3PcqNNtPA5qrudwayM8ZM4NI';
  trekCount = Array(2);


  ngOnInit(): void {
    $(document).ready(() => {
      this.initParallaxImages();
    });
  }
  ngAfterViewInit(): void {
    this.initMap();
  }
  private initMap(): void {
    this.map = L.map('map').setView([48.6260542, 23.9013792], 12);

    L.tileLayer(`https://api.mapy.cz/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=${this.API_KEY}`, {
      minZoom: 0,
      maxZoom: 19,
      attribution: '',
    }).addTo(this.map);

    const LogoControl = L.Control.extend({
      options: {
        position: 'bottomleft',
      },
      onAdd: function () {
        const container = L.DomUtil.create('div');
        const link = L.DomUtil.create('a', '', container);
        link.setAttribute('href', 'http://mapy.cz/');
        link.setAttribute('target', '_blank');
        L.DomEvent.disableClickPropagation(link);
        return container;
      }
    });

    this.map.addControl(new LogoControl());
  }
  initParallaxImages(): void {
    $('[data-parallax="scroll"]').each(function () {
      const $el = $(this);
      const imageSrc = $el.attr('data-image-src');
      const bleed = $el.attr('data-bleed') || '0';
      const positionY = $el.attr('data-position') || 'center';

      $el.addClass('zoom-out-bg');
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

  protected readonly Array = Array;
}
