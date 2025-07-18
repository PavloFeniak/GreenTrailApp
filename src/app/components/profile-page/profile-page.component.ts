import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import {FlatpickrDirective, FlatpickrModule, provideFlatpickrDefaults} from 'angularx-flatpickr';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgIf} from '@angular/common';
import {UserResponseDTO} from '../../DTO/user-response.dto';
import {UserService} from '../../services/user.service';
import {TrekResponseDto} from '../../DTO/trek-response.dto';
import {TrekService} from '../../services/trek.service';
import {MediaService} from '../../services/media.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [FlatpickrModule, FormsModule, NgIf, DatePipe],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  providers: [
    provideFlatpickrDefaults({
      altInput: true,
      dateFormat: 'Y-m-d',
      locale: 'uk'
    })
  ]
})
export class ProfilePageComponent implements OnInit, AfterViewInit, AfterViewChecked {

  public user!: UserResponseDTO;
  public trekRequest: TrekResponseDto = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startLatitude: 0,
    startLongitude: 0,
    endLatitude: 0,
    endLongitude: 0,
    nearestTown: '',
    firstPhoto: '',
    secondPhoto: ''
  };

  // trekRequest.startDate: Date = new Date();
  // endDate: Date = new Date();
  @ViewChild('myDateInput1', { static: false }) dateInput!: ElementRef;
  @ViewChild('myDateInput2', { static: false }) dateInput2!: ElementRef;




  private map: L.Map | undefined;
  private readonly API_KEY = 'HFo20yrq4X8ulf_mMAW3PcqNNtPA5qrudwayM8ZM4NI';

  startCoordinates: L.LatLng | null = null;
  endCoordinates: L.LatLng | null = null;

  startMarker: L.Marker | null = null;
  endMarker: L.Marker | null = null;

  private clickCount = 0;
  public isShowMap: boolean = false;
  public isShowAddRouteSection: boolean = false;

  constructor(private renderer: Renderer2, private userService: UserService, private trekService: TrekService, private mediaService: MediaService) {
  }



  firstPhoto: File | null = null;
  secondPhoto: File | null = null;

  onFileSelected(event: Event, index: number) {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (index === 1) this.firstPhoto = file;
    else if (index === 2) this.secondPhoto = file;
  }

  async submitTrek() {
    this.isShowAddRouteSection = false;
    console.log('Form submitted!', this.trekRequest);
    try {
      if (this.firstPhoto && this.secondPhoto) {
        const uploadedUrls = await this.uploadPhotos(this.firstPhoto, this.secondPhoto);
        this.trekRequest.firstPhoto = uploadedUrls[0];
        this.trekRequest.secondPhoto = uploadedUrls[1];
        console.log(this.trekRequest.firstPhoto);
        console.log(this.trekRequest.secondPhoto);
      }


      console.log(this.trekRequest);
      this.trekService.createTrek(this.trekRequest).subscribe({
        next: (response) => {
          console.log('Route Successfully created', response);
        },
        error: (error) => {
          console.error('Route creating error!', error);
        }
      });

    } catch (error) {
      console.error('Image Downloading error', error);
    }
  }
  toLocalDateTimeString(date: string): string {
    const dateToString = new Date(date);
    return dateToString.toISOString().slice(0, 19);
  }
  async uploadPhotos(first: File, second: File): Promise<[string, string]> {
    const firstUpload$ = this.mediaService.uploadToMediaService(first);
    const secondUpload$ = this.mediaService.uploadToMediaService(second);

    const [firstUrl, secondUrl] = await Promise.all([firstUpload$, secondUpload$]);
    return [firstUrl, secondUrl];
  }
  ngAfterViewInit(): void {



  }
  ngAfterViewChecked(): void {
    if (this.isShowAddRouteSection  && this.dateInput && this.dateInput2) {
      const altInput = this.dateInput.nativeElement.nextSibling;
      const altInput2 = this.dateInput2.nativeElement.nextSibling;
      [altInput, altInput2].forEach(el => {
        if (el instanceof HTMLElement) {
          this.renderer.setStyle(el, 'background-color', '#379cf4');
          this.renderer.setStyle(el, 'border', 'none');
          this.renderer.setStyle(el, 'width', '170px');
          this.renderer.setStyle(el, 'color', 'white');
          this.renderer.setStyle(el, 'display', 'flex');
          this.renderer.setStyle(el, 'text-align', 'center');
          this.renderer.setStyle(el, 'height', '40px');
        }
      });
    }
  }
  // toggleAddRouteSection(): void {
  //   this.isShowAddRouteSection = !this.isShowAddRouteSection;
  //   if (this.isShowAddRouteSection) {
  //     setTimeout(() => {
  //       const altInput = this.dateInput.nativeElement.nextSibling;
  //       const altInput2 = this.dateInput2.nativeElement.nextSibling;
  //       [altInput, altInput2].forEach(el => {
  //         if (el instanceof HTMLElement) {
  //           this.renderer.setStyle(el, 'background-color', '#379cf4');
  //           this.renderer.setStyle(el, 'border', 'none');
  //           this.renderer.setStyle(el, 'width', '170px');
  //           this.renderer.setStyle(el, 'color', 'white');
  //           // this.renderer.setStyle(el, 'padding-left', '35px');
  //           this.renderer.setStyle(el, 'display', 'flex');
  //           this.renderer.setStyle(el, 'text-align', 'center');
  //           this.renderer.setStyle(el, 'height', '40px');
  //         }
  //       });
  //     })
  //   }
  // }
  toggleMap() {
    this.isShowMap = !this.isShowMap;

    if (this.isShowMap) {
      setTimeout(() => {
        this.initMap();
        // Scroll до мапи
        const mapContainer = document.querySelector('.map-container');
        mapContainer?.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Виправлення розміру мапи після появи
        setTimeout(() => {
          this.map?.invalidateSize();
        }, 100);

        const buttons = document.querySelectorAll<HTMLElement>('.map-controls button, .bot-center-button');
        buttons.forEach(button => {
          L.DomEvent.disableClickPropagation(button);
        });
      });
    }

  }
  private initMap(): void {
    this.map = L.map('map', {
      zoomControl: false,
    }).setView([48.6260542, 23.9013792], 13);

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

    const customIcon = L.icon({
      iconUrl: 'assets/media/svg/map-point-icon.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      shadowUrl: '', // або свій шлях до тіні
      shadowSize: [0, 0],
      shadowAnchor: [0, 0]
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const coords = e.latlng;

      if (this.clickCount === 0) {
        this.startCoordinates = coords;
        if (this.startMarker) {
          this.map!.removeLayer(this.startMarker);
        }
        this.startMarker = L.marker(coords, { icon: customIcon, draggable: true }).addTo(this.map!);
        this.startMarker.on('dragend', (event) => {
          const marker = event.target;
          this.startCoordinates = marker.getLatLng();
          console.log('Start перетягнули на:', this.startCoordinates);
        });
        console.log('Start точка:', this.startCoordinates);
        this.clickCount++;
      } else if (this.clickCount === 1) {
        this.endCoordinates = coords;
        if (this.endMarker) {
          this.map!.removeLayer(this.endMarker);
        }
        this.endMarker = L.marker(coords, {icon: customIcon, draggable: true }).addTo(this.map!);
        this.endMarker.on('dragend', (event) => {
          const marker = event.target;
          this.endCoordinates = marker.getLatLng();
          console.log('End перетягнули на:', this.endCoordinates);
        });
        console.log('End точка:', this.endCoordinates);
        this.clickCount++;

        this.route()
      } else {
        // обнуляємо все і починаємо спочатку
        if (this.startMarker) this.map!.removeLayer(this.startMarker);
        if (this.endMarker) this.map!.removeLayer(this.endMarker);

        this.startCoordinates = coords;
        this.endCoordinates = null;
        this.startMarker = L.marker(coords, {icon: customIcon, draggable: true }).addTo(this.map!);
        this.startMarker.on('dragend', (event) => {
          const marker = event.target;
          this.startCoordinates = marker.getLatLng();
          console.log('Start перетягнули на:', this.startCoordinates);
        });
        console.log('Start точка (оновлено):', this.startCoordinates);
        this.clickCount = 1;
      }
    });
  }
  private async route(): Promise<any> {
    if (!this.startCoordinates || !this.endCoordinates) {
      console.error('Не вказані точки для побудови маршруту!');
      return;
    }

    const url = new URL('https://api.mapy.cz/v1/routing/route');
    url.searchParams.set('apikey', this.API_KEY);
    url.searchParams.set('lang', 'cs');
    url.searchParams.set('start', `${this.startCoordinates.lng},${this.startCoordinates.lat}`);
    url.searchParams.set('end', `${this.endCoordinates.lng},${this.endCoordinates.lat}`);
    url.searchParams.set('routeType', 'foot_fast');
    url.searchParams.set('avoidToll', 'false');

    const response = await fetch(url.toString(), { mode: 'cors' });
    const json = await response.json();

    const routeLayer = L.geoJSON(json.geometry, {
      style: {
        color: 'blue',
        weight: 4,
        opacity: 0.7
      }
    }).addTo(this.map!);

    this.map!.fitBounds(routeLayer.getBounds());

    return json.geometry;
  }
  ngOnInit(): void {
    this.userService.getSelfByEmail().subscribe({
      next: (user: UserResponseDTO) => {
        console.log('User data:', user);
        this.user = user;
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      }
    });

  }

  protected readonly toolbar = toolbar;


  onConfirmRoute() {
    if (this.startCoordinates && this.endCoordinates) {
      this.trekRequest.startLatitude = this.startCoordinates.lat;
      this.trekRequest.startLongitude = this.startCoordinates.lng;
      this.trekRequest.endLatitude = this.endCoordinates.lat;
      this.trekRequest.endLongitude = this.endCoordinates.lng;
      this.trekRequest.startDate = this.toLocalDateTimeString(this.trekRequest.startDate);
      this.trekRequest.endDate = this.toLocalDateTimeString(this.trekRequest.endDate);
      console.log('Coords saved in trekRequest:', this.trekRequest);
    } else {
      console.warn('Coords not selected!');
    }

    this.isShowMap = false;
  }


}
