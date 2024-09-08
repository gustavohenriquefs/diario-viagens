import { GeoName } from "./GeoNames";

export interface GeoNamesResponse {
  geonames: GeoName[];
  totalResultsCount: number;
}