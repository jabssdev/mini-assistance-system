import StudentRow from "./StudentRow";

type Props = {
	students: { id: string; name: string }[];
};

export default function StudentTable({ students }: Props) {
	return (
		<ul className="divide-y divide-gray-200 rounded border">
			{students.map((st) => (
				<StudentRow key={st.id} id={st.id} name={st.name} />
			))}
		</ul>
	);
}
