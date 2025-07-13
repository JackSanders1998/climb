// https://developer.apple.com/documentation/applemapsserverapi/-v1-search
export interface SearchInput extends BaseInput {
  /**
   * A comma-separated list of strings that describes the kind of result types to include in the response. 
   * For example, resultTypeFilter=Poi.
   */
  resultTypeFilter?: SearchResultType;
  /**
   * A value that tells the server that we expect paginated results.
   * Default: false
   */
  enablePagination?: boolean;
  /**
   * A value that indicates which page of results to return.
   */
  pageToken?: string;
}

// https://developer.apple.com/documentation/applemapsserverapi/-v1-searchautocomplete
export interface SearchACInput extends BaseInput {
  /**
   * A comma-separated list of strings that describes the kind of result types to include in the response. 
   * For example, resultTypeFilter=Poi.
   */
  resultTypeFilter?: SearchACResultType;
}

interface BaseInput {
  /**
   * (Required) The place to search for. 
   * For example, q=eiffel tower.
   */
  q: string;
  /**
   * A comma-separated list of strings that describes the points of interest to exclude from the search results. 
   * For example, excludePoiCategories=Restaurant,Cafe.
   */
  excludePoiCategories?: PoiCategory[];
  /**
   * A comma-separated list of strings that describes the points of interest to include in the search results.
   * For example, includePoiCategories=Restaurant,Cafe.
   */
  includePoiCategories?: PoiCategory[];
  /**
   * comma-separated list of two-letter ISO 3166-1 codes of the countries to limit the results to. 
   * For example, limitToCountries=US,CA limits the search to the United States and Canada.
   * If you specify two or more countries, the results reflect the best available results for some or all of the countries rather than everything related to the query for those countries.
   */
  limitToCountries?: string[];
  /**
   * The language the server should use when returning the response, specified using a BCP 47 language code. 
   * For example, for English use lang=en-US. Defaults to en-US.
   */
  lang?: string;
  /**
   * A location defined by the application as a hint. 
   * Specify the location as a comma-separated string containing the latitude and longitude. 
   * For example, searchLocation=37.78,-122.42.
   */
  searchLocation?: string;
  /**
   * A region the app defines as a hint.
   * Specify the region specified as a comma-separated string that describes the region in the form north-latitude,east-longitude,south-latitude,west-longitude.
   * For example, searchRegion=38,-122.1,37.5,-122.5.
   */
  searchRegion?: string;
  /**
   * The location of the user, specified as a comma-separated string that contains the latitude and longitude.
   * For example, userLocation=37.78,-122.42.
   */
  userLocation?: string;
  /**
   * A value that indicates the importance of the configured region.
   */
  searchRegionPriority?: "default" | "required";
  /**
   * A comma-separated list of strings that describes the addresses to include in the search results.
   * For example, includeAddressCategories=SubLocality,PostalCode.
   * If you use this parameter, you must include address in resultTypeFilter.
   */
  includeAddressCategories?: AddressCategory;
  /**
   * A comma-separated list of strings that describes the addresses to exclude in the search results.
   * For example, excludeAddressCategories=Country,AdministrativeArea.
   * If you use this parameter, you must include address in resultTypeFilter.
   */
  excludeAddressCategories?: AddressCategory;
}


// // https://developer.apple.com/documentation/applemapsserverapi/searchresponse
// export interface SearchResponse {
//   /**
//    * Represents a rectangular region on a map expressed as south-west and north-east points. 
//    * More specifically south latitude, west longitude, north latitude and east longitude.
//    */
//   displayMapRegion: MapRegion;
//   results: SearchResponsePlace[];
// }

// // https://developer.apple.com/documentation/applemapsserverapi/searchmapregion
// export interface SearchMapRegion {}

export interface ErrorResponse {
  code: string;
  status: 400 | 401 | 429 | 500; // HTTP status code
  response: {
    data: {
      error: {
        details: string[];  // An array of strings with additional details about the error
        message: string;    // A message that provides details about the error.
      }
    }
  }
}

// https://developer.apple.com/documentation/applemapsserverapi/searchmapregion
interface SearchMapRegion {
  eastLongitude: number;  // A double value that describes the east longitude of the map region.
  northLatitude: number;  // A double value that describes the north latitude of the map region.
  southLatitude: number;  // A double value that describes the south latitude of the map region.
  westLongitude: number;  // A double value that describes the west longitude of the map region.
}

interface Location {
  latitude: number;
  longitude: number;
}


type AddressCategory =
  | "Country"               // Countries and regions.
  | "AdministrativeArea"    // The primary administrative divisions of countries or regions.
  | "SubAdministrativeArea" // The secondary administrative divisions of countries or regions.
  | "Locality"              // Local administrative divisions, postal cities and populated places.
  | "SubLocality"           // Local administrative sub-divisions, postal city sub-districts, and neighborhoods.
  | "PostalCode"            // A code assigned to addresses for mail sorting and delivery.


interface StructuredAddress {
  administrativeArea: string;
  administrativeAreaCode: string;
  areasOfInterest: string[];
  dependentLocalities: string[];
  fullThoroughfare: string;
  locality: string;
  postCode: string;
  subLocality: string;
  subThoroughfare: string;
  thoroughfare: string;
}

interface Place {
  country: string;
  countryCode: string;
  // displayMapRegion: MapRegion;
  formattedAddressLines: string[];
  name: string;
  coordinate: Location;
  structuredAddress: StructuredAddress;
}

interface ETA {
  destination: Location;
  distanceMeters: number;
  expectedTravelTimeSeconds: number;
  staticTravelTimeSeconds: number;
  transportType: TransportType;
}

// interface SearchResponsePlace extends Place {
//   poiCategory: PoiCategory;
// }

export interface GeocodeInput {
  q: string;
  limitToCountries?: string[];
  lang?: string;
  searchLocation?: string;
  searchRegion?: string;
  userLocation?: string;
}

export interface ReverseGeocodeInput {
  loc: string;
  lang?: string;
}

export interface ETAInput {
  origin: string;
  destinations: string[];
  transportType?: TransportType;
  departureDate?: string;
  arrivalDate?: string;
}

export interface GeocodeResponse {
  results: Place[];
}

export interface ReverseGeocodeResponse {
  results: Place[];
}

export interface ETAResponse {
  etas: ETA[];
}

type SearchResultType =
  | "poi"               //  physical feature or a point of interest.
  | "address"           //  An address such as a street address, suburb, city, state, or country.
  | "physicalFeature"   //  A natural physical feature, such as a river, mountain, or delta.
  | "pointOfInterest";  // A point of interest such as a cafe or grocery store.

type SearchACResultType =
  SearchResultType
  | "query";            // A search query string.

type TransportType = "Automobile" | "Transit" | "Walking";

// https://developer.apple.com/documentation/applemapsserverapi/poicategory
export type PoiCategory =
  | "Airport"
  | "AirportGate"
  | "AirportTerminal"
  | "AmusementPark"
  | "AnimalService"
  | "Aquarium"
  | "ATM"
  | "AutomotiveRepair"
  | "Bakery"
  | "Bank"
  | "Baseball"
  | "Basketball"
  | "Beach"
  | "Beauty"
  | "Bowling"
  | "Brewery"
  | "Cafe"
  | "Campground"
  | "CarRental"
  | "Castle"
  | "ConventionCenter"
  | "Distillery"
  | "EVCharger"
  | "Fairground"
  | "FireStation"
  | "Fishing"
  | "FitnessCenter"
  | "FoodMarket"
  | "Fortress"
  | "GasStation"
  | "GoKart"
  | "Golf"
  | "Hiking"
  | "Hospital"
  | "Hotel"
  | "Kayaking"
  | "Landmark"
  | "Laundry"
  | "Library"
  | "Mailbox"
  | "Marina"
  | "MiniGolf"
  | "MovieTheater"
  | "Museum"
  | "MusicVenue"
  | "NationalMonument"
  | "NationalPark"
  | "Nightlife"
  | "Park"
  | "Parking"
  | "Pharmacy"
  | "Planetarium"
  | "Playground"
  | "Police"
  | "PostOffice"
  | "PublicTransport"
  | "ReligiousSite"
  | "Restaurant"
  | "Restroom"
  | "RockClimbing"
  | "RVPark"
  | "School"
  | "SkatePark"
  | "Skating"
  | "Skiing"
  | "Soccer"
  | "Spa"
  | "Stadium"
  | "Store"
  | "Surfing"
  | "Swimming"
  | "Tennis"
  | "Theater"
  | "University"
  | "Volleyball"
  | "Winery"
  | "Zoo";