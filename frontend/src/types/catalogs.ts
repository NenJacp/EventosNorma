export interface CityViewModel {
  id: number;
  name: string;
  stateId: number;
  stateName?: string;
}

export interface StateViewModel {
  id: number;
  name: string;
  countryId: number;
  countryName?: string;
}

export interface CountryViewModel {
  id: number;
  name: string;
}

export interface EventCategoryViewModel {
  id: number;
  name: string;
  description?: string;
}

export interface EventTypeViewModel {
  id: number;
  name: string;
  description?: string;
}