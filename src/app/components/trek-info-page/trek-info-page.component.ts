import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { RouterLink } from '@angular/router';
import * as ScrollMagic from 'scrollmagic';
import { gsap } from 'gsap';
import '@raruto/leaflet-elevation'
import {ProfileSmComponent} from '../reusable/profile-sm/profile-sm.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ProblemTrekPreviewComponent} from '../problem-trek-preview/problem-trek-preview.component';
import {TrekPreviewComponent} from '../trek-preview/trek-preview.component';

@Component({
  selector: 'app-trek-info-page',
  imports: [
    RouterLink,
    ProfileSmComponent,
    NgForOf,
    TrekPreviewComponent,
    NgIf,
    NgClass
  ],
  templateUrl: './trek-info-page.component.html',
  styleUrl: './trek-info-page.component.css'
})
export class TrekInfoPageComponent implements AfterViewInit, OnInit {

  profiles = Array(5);
  treks = Array(3);

  userSmBack: boolean = false;
  groupShow: boolean = false;



  private map!: L.Map;
  private API_KEY = 'HFo20yrq4X8ulf_mMAW3PcqNNtPA5qrudwayM8ZM4NI';
  private controlElevation: any;
  private coordsStart = [23.9013792, 48.6260542];
  private coordsEnd = [23.9913792, 48.6260542];
  private controller: ScrollMagic.Controller;
  private timeoutId: any;

  constructor() {
    this.controller = new ScrollMagic.Controller();
  }

  ngOnInit(): void {
    const scene = new ScrollMagic.Scene({
      triggerHook: 0,
      offset: 100
    }).on('enter', () => {
      this.timeoutId = setTimeout(() => {
        gsap.to('#footer', { opacity: 1, duration: 0.5 });
      }, 100);
    }).addTo(this.controller);
  }


  ngAfterViewInit(): void {
    this.initMap();
    this.map.whenReady(() => this.main());
  }

  private initMap(): void {
    this.map = L.map('map').setView([49.8729317, 14.8981184], 16);

    L.tileLayer(`https://api.mapy.cz/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=${this.API_KEY}`, {
      minZoom: 0,
      maxZoom: 19,
    }).addTo(this.map);

    this.controlElevation = (L.control as any).elevation({
      detached: true,
      elevationDiv: "#elevation-div",
      position: 'bottomright',
      speed: false,
      altitude: true,
      time: false,
      summary: false,
      legend: false,
      distanceMarkers: false,
      hotline: false,
      height: 200,
    }).addTo(this.map);

    // Add logo
    const LogoControl = L.Control.extend({
      options: { position: 'bottomleft' },
      onAdd: function () {
        const container = L.DomUtil.create('div');
        const link = L.DomUtil.create('a', '', container);
        L.DomEvent.disableClickPropagation(link);
        return container;
      },
    });
    new LogoControl().addTo(this.map);
  }

  private async route(): Promise<any> {
    const url = new URL('https://api.mapy.cz/v1/routing/route');
    url.searchParams.set('apikey', this.API_KEY);
    url.searchParams.set('lang', 'cs');
    url.searchParams.set('start', this.coordsStart.join(','));
    url.searchParams.set('end', this.coordsEnd.join(','));
    url.searchParams.set('routeType', 'foot_fast');
    url.searchParams.set('avoidToll', 'false');

    const response = await fetch(url.toString(), { mode: 'cors' });
    const json = await response.json();

    // Додати маршрут на мапу як GeoJSON
    const routeLayer = L.geoJSON(json.geometry, {
      style: {
        color: 'blue',
        weight: 4,
        opacity: 0.7
      }
    }).addTo(this.map);

    // Центруємо мапу по маршруту
    this.map.fitBounds(routeLayer.getBounds());

    return json.geometry;
  }


  private selectPoints(geometry: any): any[] {
    const points = geometry.geometry.coordinates;
    const step = Math.ceil(points.length / 256);
    // @ts-ignore
    return points.filter((_, index) => index % step === 0);
  }

  private async getElevationGeoJson(points: any[]): Promise<string> {
    const positions = points.map(p => p.join(',')).join(';');
    const url = `https://api.mapy.cz/v1/elevation?lang=cs&positions=${positions}&apikey=${this.API_KEY}`;
    const response = await fetch(url, { mode: 'cors' });
    const data = await response.json();

    const geojson = {
      name: 'demo.geojson',
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: data.items.map((item: any) => [
            item.position.lon,
            item.position.lat,
            item.elevation
          ])
        }
      }]
    };

    return JSON.stringify(geojson);
  }

  private async main(): Promise<void> {
    const routeData = await this.route();
    const points = this.selectPoints(routeData);
    const elevationGeoJson = await this.getElevationGeoJson(points);
    this.controlElevation.load(elevationGeoJson);
  }








}
