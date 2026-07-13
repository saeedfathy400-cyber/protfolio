import { useMutation, useQueryClient } from "@tanstack/react-query";
import { visitService } from "../services/visit.service";
import { ScheduleVisitInput, SubmitVisitReportInput } from "../types/visit.types";
import { VisitStatus } from "../constants/visit.constants";
import { VISITS_QUERY_KEY } from "./useVisits";

// Replaced by the authenticated user's enterprise code from AuthContext (Sprint 1) once wired in.
const CURRENT_ACTOR_CODE = "USR-SHQ-MQ-2026-000001";

export function useScheduleVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ScheduleVisitInput) => visitService.schedule(input, CURRENT_ACTOR_CODE),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [VISITS_QUERY_KEY] }),
  });
}

export function useChangeVisitStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ visitCode, nextStatus }: { visitCode: string; nextStatus: VisitStatus }) =>
      visitService.changeStatus(visitCode, nextStatus, CURRENT_ACTOR_CODE),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [VISITS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["visit", variables.visitCode] });
    },
  });
}

export function useSubmitVisitReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SubmitVisitReportInput) => visitService.submitReport(input, CURRENT_ACTOR_CODE),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [VISITS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["visit", variables.visitCode] });
    },
  });
}
