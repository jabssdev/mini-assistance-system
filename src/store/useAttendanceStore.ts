import { create } from "zustand";
import type { AttendanceStatus, Student, TermConfig } from "../types/domain";

type State = {
	term: TermConfig;
	students: Student[];
	attendance: Record<string, Record<number, AttendanceStatus>>;
};

type Actions = {
	seedStudents: (names?: string[]) => void;
	setAttendance: (studentId: string, day: number, status: AttendanceStatus) => void;
	clearAll: () => void;
};

const DEFAULT_TERM: TermConfig = { id: "default", days: 30, absenceThreshold: 0.1 };

const DEFAULT_19: string[] = [
	"Alumno 01",
	"Alumno 02",
	"Alumno 03",
	"Alumno 04",
	"Alumno 05",
	"Alumno 06",
	"Alumno 07",
	"Alumno 08",
	"Alumno 09",
	"Alumno 10",
	"Alumno 11",
	"Alumno 12",
	"Alumno 13",
	"Alumno 14",
	"Alumno 15",
	"Alumno 16",
	"Alumno 17",
	"Alumno 18",
	"Alumno 19",
];

export const useAttendanceStore = create<State & Actions>()((set) => ({
	term: DEFAULT_TERM,
	students: [],
	attendance: {},

	seedStudents: (names = DEFAULT_19) =>
		set(() => ({
			students: names.map((name, i) => ({ id: String(i + 1), name })),
		})),

	setAttendance: (studentId, day, status) =>
		set((s) => ({
			attendance: {
				...s.attendance,
				[studentId]: { ...(s.attendance[studentId] || {}), [day]: status },
			},
		})),

	clearAll: () => set({ students: [], attendance: {} }),
}));

// Helper
export const selectStudentSummary = (studentId: string) => (state: State) => {
	const { days, absenceThreshold } = state.term;
	const map = state.attendance[studentId] || {};

	let P = 0,
		F = 0;
	for (let d = 1; d <= days; d++) {
		if (map[d] === "P") P++;
		if (map[d] === "F") F++;
	}

	const pctF = days > 0 ? (F / days) * 100 : 0;
	const maxF = Math.floor(days * absenceThreshold);
	const completed = P + F === days;
	const aprobado = completed && F <= maxF;

	return { P, F, pctF, maxF, completed, aprobado };
};
