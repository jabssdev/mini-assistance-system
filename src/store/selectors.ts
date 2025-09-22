import type { State } from "./useAttendanceStore";
import { computeStudentSummary } from "../utils/stats";

export const makeStudentSummarySelector = (studentId: string) => (state: State) => computeStudentSummary(state.term, state.attendance[studentId]);
