import Image from "next/image";

//Urql
import { Student } from "@/Urql/Types/Weaver/weaver.types";

//Interface 
interface Props {
    student: Student
}

const Profile = ({ student }: Props) => {
    return (
        <div className="flex gap-5 w-[80%]">
            <div className="basis-[20%]">
                {student.image ? (
                    <Image src={process.env.NEXT_PUBLIC_IMAGE_URL + student.image} alt={student.name} width={400} height={400} className="w-full h-full object-cover object-center rounded-md" />
                ) : (
                    <Image src="/images/placeholder-women.png" alt={student.name} width={400} height={400} className="w-full h-full object-cover object-center rounded-md" />
                )}
            </div>
            <div className="flex-1">
                <ul>
                    <li className="flex gap-2 border-b border-solid border-textColor border-opacity-20 py-2 mb-2 px-4"><span className="flex-1 text-main font-semibold">Student Name</span><span>{student.name}</span></li>
                    <li className="flex gap-2 border-b border-solid border-textColor border-opacity-20 py-2 mb-2 px-4"><span className="flex-1 text-main font-semibold">Class</span><span>{student.class.name}</span></li>
                    <li className="flex gap-2 border-b border-solid border-textColor border-opacity-20 py-2 mb-2 px-4"><span className="flex-1 text-main font-semibold">Shift</span><span>{student.shift.name}</span></li>
                    <li className="flex gap-2 border-b border-solid border-textColor border-opacity-20 py-2 mb-2 px-4"><span className="flex-1 text-main font-semibold">Section</span><span>{student.section.name}</span></li>
                </ul>
            </div>
            <div className="flex-1">
                <ul>
                    <li className="flex gap-2 border-b border-solid border-textColor border-opacity-20 py-2 mb-2 px-4"><span className="flex-1 text-main font-semibold">Group</span><span>{student.group?.name}</span></li>
                    <li className="flex gap-2 border-b border-solid border-textColor border-opacity-20 py-2 mb-2 px-4"><span className="flex-1 text-main font-semibold">Mother Name</span><span>{student.motherName}</span></li>
                    <li className="flex gap-2 border-b border-solid border-textColor border-opacity-20 py-2 mb-2 px-4"><span className="flex-1 text-main font-semibold">ID</span><span>{student.studentId}</span></li>
                    <li className="flex gap-2 border-b border-solid border-textColor border-opacity-20 py-2 mb-2 px-4"><span className="flex-1 text-main font-semibold">Father Name</span><span>{student.fatherName}</span></li>
                </ul>
            </div>
        </div>
    );
};

export default Profile;