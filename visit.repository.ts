import { ListQuery, PagedResult } from "@/types/common.types";
import { Visit } from "../types/visit.types";

/**
 * Repository contract. This is the ONLY boundary the rest of the app talks
 * to. Today `MockVisitRepository` implements it against in-memory fake data.
 * Sprint 10 (Firebase Integration) adds `FirestoreVisitRepository` that
 * implements the same interface against Firestore — zero changes required
 * in hooks, pages, or components.
 */
export interface IVisitRepository {
  list(query: ListQuery & { caseCode?: string; status?: string }): Promise<PagedResult<Visit>>;
  getByCode(visitCode: string): Promise<Visit | null>;
  create(visit: Visit): Promise<Visit>;
  update(visitCode: string, changes: Partial<Visit>): Promise<Visit>;
}
