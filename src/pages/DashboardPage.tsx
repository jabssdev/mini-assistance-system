import { useEffect } from "react";
import { useAttendanceStore } from "../store/useAttendanceStore";
import DashboardActions from "../components/DashboardActions";
import StudentTable from "../components/StudentTable";

export default function DashboardPage() {
	const students = useAttendanceStore((s) => s.students);
	const load = useAttendanceStore((s) => s.loadFromDB);

	useEffect(() => {
		load();
	}, [load]);

	return (
		<div className="p-6 max-w-3xl mx-auto space-y-4">
			<h1 className="text-3xl font-bold">Sistema de Asistencia 🚀</h1>

			<DashboardActions
				onOpenRegister={() => {
					console.log("Abrir modal de registro");
				}}
			/>

			<StudentTable students={students} />
		</div>
	);
}
