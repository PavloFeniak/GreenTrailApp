import { Component } from '@angular/core';
import {AppComponent} from '../../app.component';
declare var L: any; // щоб мати доступ до глобальної змінної Leaflet


@Component({
  selector: 'app-test',
  imports: [
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    const map = L.map('map').setView([41.4583, 12.7059], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const controlElevation = L.control.elevation({
      theme: 'lightblue-theme',
      detached: true,
      elevationDiv: '#elevation-div',
      autohide: false
    }).addTo(map);

    controlElevation.load("https://raruto.github.io/leaflet-elevation/examples/via-emilia.gpx");
  }
}
