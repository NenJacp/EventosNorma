export interface EventViewModel {
  id: number;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate: string;
  locationDetail: string;
  cityName: string;
  eventCategoryName: string;
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
}

export type EventStatus = "Draft" | "Published" | "Cancelled" | "Closed";

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
