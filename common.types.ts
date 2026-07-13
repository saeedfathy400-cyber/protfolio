/**
 * Base contract every LCMS entity must satisfy.
 * Firestore document IDs are NEVER exposed in the UI — `code` is the
 * user-facing Enterprise Code (see enterprise-coding.constants.ts).
 */
export interface BaseEntity {
  id: string; // internal id (Firestore doc id once connected) — never rendered
  code: string; // enterprise code, e.g. VIS-SHQ-MQ-2026-000001
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  createdBy: string; // USR-... enterprise code
  updatedBy: string; // USR-... enterprise code
  deletedAt?: string | null; // soft delete marker
}

/** Generic paginated result shape returned by every list-fetching service. */
export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Generic query params shared by every list hook/service. */
export interface ListQuery {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

/** A single audit-trail / timeline entry, reused by every feature's Timeline tab. */
export interface TimelineEntry {
  id: string;
  entityCode: string; // the CAS-/VIS-/RES-... code this entry belongs to
  action: string; // e.g. "زيارة مجدولة", "تم اعتماد البحث الاجتماعي"
  performedBy: string; // USR-... code
  performedByName: string;
  occurredAt: string; // ISO 8601
  metadata?: Record<string, string | number>;
}
