import { useMemo } from "react";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { useAttendanceStore } from "../store/useAttendanceStore";
import { makeStudentSummarySelector } from "../store/selectors";

type Props = { id: string; name: string };

export default function StudentRow({ id, name }: Props) {
	const selector = useMemo(() => makeStudentSummarySelector(id), [id]);

	const summary = useStoreWithEqualityFn(useAttendanceStore, selector, shallow);

	return (
		<li className="p-3 flex items-center justify-between">
			<span className="font-medium">{name}</span>
			<span className="text-sm">
				P: {summary.P} · F: {summary.F} · %F: {summary.pctF.toFixed(0)}% · {summary.completed ? (summary.aprobado ? "✅ Aprobado" : "❌ Desaprobado") : "En curso"}
			</span>
		</li>
	);
}
