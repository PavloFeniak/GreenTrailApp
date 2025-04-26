import {AfterViewInit, Component, OnInit} from '@angular/core';
import $ from 'jquery';
import 'animate.css';
import * as L from 'leaflet';

declare var SMap: any;

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit, AfterViewInit  {
  private map: L.Map | undefined;
  private readonly API_KEY = 'HFo20yrq4X8ulf_mMAW3PcqNNtPA5qrudwayM8ZM4NI';


  ngOnInit(): void {
    $(document).ready(() => {
      this.initParallaxImages();
    });
  }
  ngAfterViewInit(): void {
    this.initMap();
  }
  private initMap(): void {
    this.map = L.map('map').setView([48.6260542, 23.9013792], 16);

    L.tileLayer(`https://api.mapy.cz/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=${this.API_KEY}`, {
      minZoom: 0,
      maxZoom: 19,
      attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
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
        link.innerHTML = '<img src="https://api.mapy.cz/img/api/logo.svg" alt="Mapy.cz Logo"/>';
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
