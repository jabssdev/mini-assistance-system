import type { AttendanceStatus, TermConfig } from "../types/domain";

type StudentSummary = {
	P: number;
	F: number;
	pctF: number;
	maxF: number;
	completed: boolean;
	aprobado: boolean;
};

export function computeStudentSummary(term: TermConfig, dayMap: Record<number, AttendanceStatus> | undefined): StudentSummary {
	const { days, absenceThreshold } = term;
	const map = dayMap || {};

	let P = 0;
	let F = 0;
	for (const v of Object.values(map)) {
		if (v === "P") P++;
		else if (v === "F") F++;
	}

	const totalMarcados = P + F;
	const completed = totalMarcados === days;
	const pctF = days ? (F / days) * 100 : 0;
	const maxF = Math.floor(days * absenceThreshold);
	const aprobado = completed && F <= maxF;

	return { P, F, pctF, maxF, completed, aprobado };
}
