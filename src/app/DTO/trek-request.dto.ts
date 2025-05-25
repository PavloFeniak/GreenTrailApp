export interface TrekRequestDto {
  id: number;
  title: string;
  description: string;
  startDate: Date | string;       // ISO string '2025-06-01T10:00:00'
  endDate: Date | string;         // ISO string, або Date
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
  nearestTown: string;
  firstPhoto: string;
  secondPhoto: string;
  createdBy: string;
  createdAt: string;       // ISO string
}
