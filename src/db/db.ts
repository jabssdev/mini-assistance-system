import Dexie from "dexie";
import type { Table } from "dexie";
import type { Attendance, Student, TermConfig } from "../types/domain";

export class AttendanceDB extends Dexie {
	students!: Table<Student, string>;
	term!: Table<TermConfig, string>;
	attendance!: Table<Attendance, string>;

	constructor() {
		super("attendance-db");
		this.version(1).stores({
			students: "id, name",
			term: "id",
			attendance: "id, studentId, day, status",
		});
	}
}

export const db = new AttendanceDB();

export async function seedIfEmpty() {
	const count = await db.students.count();
	if (count > 0) return;

	const names = [
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

	await db.transaction("rw", db.students, db.term, async () => {
		await db.term.put({ id: "default", days: 30, absenceThreshold: 0.1 });
		await db.students.bulkAdd(names.map((name, i) => ({ id: String(i + 1), name })));
	});
}

export async function clearAllDB() {
	await db.transaction("rw", db.students, db.term, db.attendance, async () => {
		await db.attendance.clear();
		await db.students.clear();
		await db.term.clear();
	});
}
