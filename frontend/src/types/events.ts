export interface EventViewModel {
  id: number;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate: string;
  locationDetail: string;
  cityId: number;
  cityName: string;
  stateId: number;
  stateName: string;
  countryId: number;
  countryName: string;
  eventCategoryId: number;
  eventCategoryName: string;
  eventTypeId: number;
  eventTypeName: string;
  creatorName: string;
  status: EventStatus;
  maxCapacity: number;
  currentCapacity: number;
  isFull: boolean;
  availableSlots: number;
  isPrivate: boolean;
  accessCode?: string;
  isActive: boolean;
  imageUrl?: string;
  displayImageUrl: string;
  isCreator: boolean;
  isMember: boolean;
  showJoinButton?: boolean;
  joinedAt?: string;
  hasExited?: boolean;
}

export type EventStatus = "Draft" | "Published" | "Cancelled" | "Closed" | "Open";

export interface SubscriptionViewModel {
  eventId: number;
  slug: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  locationDetail: string;
  cityName: string;
  categoryName: string;
  typeName: string;
  creatorName: string;
  status: EventStatus;
  joinedAt: string;
  isActive: boolean;
  maxCapacity: number;
  currentCapacity: number;
  hasExited: boolean;
  isFull: boolean;
  availableSlots: number;
}

export interface PagedList<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface EventsResponse {
  items: EventViewModel[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
