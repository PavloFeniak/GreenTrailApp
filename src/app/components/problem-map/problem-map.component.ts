import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {NgForOf, NgIf} from '@angular/common';
import {ProblemTrekPreviewComponent} from '../problem-trek-preview/problem-trek-preview.component';

@Component({
  selector: 'app-problem-map',
  imports: [
    ProblemTrekPreviewComponent,
    NgForOf
  ],
  templateUrl: './problem-map.component.html',
  styleUrl: './problem-map.component.css'
})
export class ProblemMapComponent implements AfterViewInit, OnInit {

  treks = Array(5);

  private map: L.Map | undefined;
  private readonly API_KEY = 'HFo20yrq4X8ulf_mMAW3PcqNNtPA5qrudwayM8ZM4NI';
  isHover: boolean = false;
  ngAfterViewInit(): void {
    this.initMap();
    // this.setupHoverListeners();
  }
  private initMap(): void {
    this.map = L.map('map',{
      zoomControl: false,
    }).setView([48.6260542, 23.9013792], 16);

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
  ngOnInit(): void {

  }
  private setupHoverListeners(): void {
    const button = document.querySelector('.bot-center-button');
    const mapContainer = document.querySelector('.google-map');

    if (button && mapContainer) {
      button.addEventListener('mouseenter', () => {
        mapContainer.classList.add('hovered');
      });

      button.addEventListener('mouseleave', () => {
        mapContainer.classList.remove('hovered');
      });
    }
  }
}
