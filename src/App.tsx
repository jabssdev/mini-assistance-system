import { useEffect } from "react";
import { useAttendanceStore, selectStudentSummary } from "./store/useAttendanceStore";
import { clearAllDB, seedIfEmpty } from "./db/db";

export const App = () => {
	const students = useAttendanceStore((s) => s.students);
	const setAttendance = useAttendanceStore((s) => s.setAttendance);
	const term = useAttendanceStore((s) => s.term);
	const load = useAttendanceStore((s) => s.loadFromDB);
	const attendance = useAttendanceStore();

	useEffect(() => {
		load();
	}, [load]);

	const markDay1PresentAll = () => {
		students.forEach((st) => setAttendance(st.id, 1, "P"));
	};

	const clear = async () => {
		try {
			await clearAllDB();
			await seedIfEmpty();
			await load();
		} catch (e) {
			console.error("Error reseteando la DB", e);
		}
	};

	return (
		<div className="p-6 max-w-3xl mx-auto space-y-4">
			<h1 className="text-3xl font-bold">Sistema de Asistencia 🚀</h1>

			<div className="flex items-center gap-3">
				<button onClick={markDay1PresentAll} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
					Marcar Día 1: Presente para todos
				</button>
				<button onClick={clear} className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700">
					🔄 Reset DB
				</button>
				<span className="text-sm text-gray-500">Días del término: {term.days}</span>
			</div>

			<ul className="divide-y divide-gray-200 rounded border">
				{students.map((st) => {
					const s = selectStudentSummary(st.id)(attendance);
					return (
						<li key={st.id} className="p-3 flex items-center justify-between">
							<span className="font-medium">{st.name}</span>
							<span className="text-sm">
								P: {s.P} || F: {s.F} || %F: {s.pctF.toFixed(0)}% || {s.completed ? (s.aprobado ? "✅ Aprobado" : "❌ Desaprobado") : "En curso"}
							</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
};
