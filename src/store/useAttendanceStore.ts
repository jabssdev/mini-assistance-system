import { create } from "zustand";
import { db, seedIfEmpty } from "../db/db";
import type { AttendanceStatus, Student, TermConfig } from "../types/domain";

export type State = {
	term: TermConfig;
	students: Student[];
	attendance: Record<string, Record<number, AttendanceStatus>>;
};

type Actions = {
	loadFromDB: () => Promise<void>;
	setAttendance: (studentId: string, day: number, status: AttendanceStatus) => void;
	clearAll: () => void;
};

const DEFAULT_TERM: TermConfig = { id: "default", days: 30, absenceThreshold: 0.3 };

export const useAttendanceStore = create<State & Actions>()((set) => ({
	term: DEFAULT_TERM,
	students: [],
	attendance: {},

	loadFromDB: async () => {
		await seedIfEmpty();
		const [students, term, attendance] = await Promise.all([db.students.orderBy("name").toArray(), db.term.get("default"), db.attendance.toArray()]);

		const map: Record<string, Record<number, AttendanceStatus>> = {};
		for (const a of attendance) {
			if (!map[a.studentId]) map[a.studentId] = {};
			map[a.studentId][a.day] = a.status;
		}

		set({
			students,
			term: term || { id: "default", days: 30, absenceThreshold: 0.3 },
			attendance: map,
		});
	},

	setAttendance: (studentId, day, status) =>
		set((s) => {
			const attendance = {
				...s.attendance,
				[studentId]: { ...(s.attendance[studentId] || {}), [day]: status },
			};

			const id = `${studentId}-${day}`;
			db.attendance.put({ id, studentId, day, status }).catch(console.error);
			return { attendance };
		}),

	clearAll: () => set({ students: [], attendance: {} }),
}));
