export type AttendanceStatus = "P" | "F";

export interface Student {
	id: string;
	name: string;
}

export interface TermConfig {
	id: string;
	days: number;
	absenceThreshold: number;
}

export interface Attendance {
	id: string;
	studentId: string;
	day: number;
	status: AttendanceStatus;
}
