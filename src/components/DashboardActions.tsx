import { useAttendanceStore } from "../store/useAttendanceStore";
import { clearAllDB, seedIfEmpty } from "../db/db";

type Props = {
	onOpenRegister?: () => void;
};

export default function DashboardActions({ onOpenRegister }: Props) {
	const load = useAttendanceStore((s) => s.loadFromDB);
	const students = useAttendanceStore((s) => s.students);
	const setAttendance = useAttendanceStore((s) => s.setAttendance);
	const term = useAttendanceStore((s) => s.term);

	const markDay1PresentAll = () => {
		students.forEach((st) => setAttendance(st.id, 1, "P"));
	};

	const reset = async () => {
		await clearAllDB();
		await seedIfEmpty();
		await load();
	};

	return (
		<div className="flex items-center gap-3">
			<button onClick={onOpenRegister} className="px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700">
				Registrar asistencia
			</button>

			<button onClick={markDay1PresentAll} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
				Marcar Día 1: Presente para todos
			</button>

			<button onClick={reset} className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700">
				🔄 Reset DB
			</button>

			<span className="text-sm text-gray-500">Días del término: {term.days}</span>
		</div>
	);
}
