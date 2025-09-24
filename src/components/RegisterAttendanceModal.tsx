import { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAttendanceStore } from "../store/useAttendanceStore";
import type { AttendanceStatus } from "../types/domain";

type Props = {
	open: boolean;
	onClose: () => void;
};

type DraftMap = Record<string, AttendanceStatus>; // studentId -> 'P' | 'F'

export default function RegisterAttendanceModal({ open, onClose }: Props) {
	const students = useAttendanceStore((s) => s.students);
	const term = useAttendanceStore((s) => s.term);
	const attendance = useAttendanceStore((s) => s.attendance);
	const setAttendance = useAttendanceStore((s) => s.setAttendance);

	const [day, setDay] = useState<number>(1);
	const [draft, setDraft] = useState<DraftMap>({});

	// Cargar el "estado actual" de ese día como base del borrador
	useEffect(() => {
		if (!open) return;
		const next: DraftMap = {};
		for (const st of students) {
			const prev = attendance[st.id]?.[day];
			// si no existe marca previa, por defecto Presente (P); cámbialo si quieres 'F'
			next[st.id] = (prev ?? "P") as AttendanceStatus;
		}
		setDraft(next);
	}, [open, day, students, attendance]);

	const hasExistingMarksForDay = useMemo(() => {
		return students.some((st) => attendance[st.id]?.[day] !== undefined);
	}, [students, attendance, day]);

	const markAll = (status: AttendanceStatus) => {
		setDraft((d) => {
			const copy: DraftMap = { ...d };
			for (const st of students) copy[st.id] = status;
			return copy;
		});
	};

	const setOne = (studentId: string, status: AttendanceStatus) => {
		setDraft((d) => ({ ...d, [studentId]: status }));
	};

	const onSave = async () => {
		// guardado en lote: upsert por alumno/día
		for (const st of students) {
			const status = draft[st.id] ?? "P";
			setAttendance(st.id, day, status);
		}
		onClose();
	};

	return (
		<Transition show={open} as={Fragment}>
			<Dialog onClose={onClose} className="relative z-50">
				{/* Fondo */}
				<Transition.Child
					as={Fragment}
					enter="transition-opacity ease-out duration-150"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black/40" />
				</Transition.Child>

				{/* Panel */}
				<div className="fixed inset-0 flex items-center justify-center p-4">
					<Transition.Child
						as={Fragment}
						enter="transition-transform ease-out duration-150"
						enterFrom="opacity-0 translate-y-2 scale-95"
						enterTo="opacity-100 translate-y-0 scale-100"
						leave="transition-transform ease-in duration-100"
						leaveFrom="opacity-100 translate-y-0 scale-100"
						leaveTo="opacity-0 translate-y-2 scale-95"
					>
						<Dialog.Panel className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
							<div className="p-5 border-b">
								<Dialog.Title className="text-xl font-semibold">Registrar asistencia</Dialog.Title>
								<p className="text-sm text-gray-500 mt-1">Selecciona el día y marca Presente (P) o Falta (F) para cada alumno.</p>
							</div>

							<div className="p-5 space-y-4">
								{/* Selector de día */}
								<div className="flex flex-wrap items-center gap-3">
									<label className="text-sm font-medium">Día:</label>
									<select value={day} onChange={(e) => setDay(Number(e.target.value))} className="rounded border px-3 py-2 text-sm">
										{Array.from({ length: term.days }, (_, i) => i + 1).map((d) => (
											<option key={d} value={d}>
												{d}
											</option>
										))}
									</select>

									<div className="ms-auto flex items-center gap-2">
										<button onClick={() => markAll("P")} className="px-3 py-2 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700">
											Marcar todos P
										</button>
										<button onClick={() => markAll("F")} className="px-3 py-2 text-sm rounded bg-rose-600 text-white hover:bg-rose-700">
											Marcar todos F
										</button>
									</div>
								</div>

								{hasExistingMarksForDay && (
									<div className="rounded border border-amber-300 bg-amber-50 text-amber-800 px-3 py-2 text-xs">Ya existen marcas registradas para el día {day}. Guardar volverá a escribirlas.</div>
								)}

								{/* Lista de alumnos */}
								<div className="max-h-[50vh] overflow-auto rounded border">
									<table className="w-full text-sm">
										<thead className="bg-gray-50 sticky top-0">
											<tr>
												<th className="text-left px-3 py-2 font-medium">Alumno</th>
												<th className="text-center px-3 py-2 font-medium w-40">Asistencia</th>
											</tr>
										</thead>
										<tbody>
											{students.map((st, idx) => (
												<tr key={st.id} className={idx % 2 ? "bg-white" : "bg-gray-50/50"}>
													<td className="px-3 py-2">{st.name}</td>
													<td className="px-3 py-2">
														<div className="flex items-center justify-center gap-6">
															<label className="inline-flex items-center gap-1">
																<input type="radio" name={`att-${st.id}`} className="accent-emerald-600" checked={draft[st.id] === "P"} onChange={() => setOne(st.id, "P")} />
																<span>P</span>
															</label>
															<label className="inline-flex items-center gap-1">
																<input type="radio" name={`att-${st.id}`} className="accent-rose-600" checked={draft[st.id] === "F"} onChange={() => setOne(st.id, "F")} />
																<span>F</span>
															</label>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>

							<div className="p-5 border-t flex items-center justify-end gap-2">
								<button onClick={onClose} className="px-4 py-2 text-sm rounded border hover:bg-gray-50">
									Cancelar
								</button>
								<button onClick={onSave} className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700">
									Guardar
								</button>
							</div>
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
}
