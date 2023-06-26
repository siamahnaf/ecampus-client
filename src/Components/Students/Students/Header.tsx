import { useContext } from "react";

//Component
import ExportTable from "@/Components/Common/ExportTable";

//Context
import { PaginationContext } from "@/Context/student-pagination.context";

//Urql
import { useQuery } from "urql";
import { GET_ALL_STUDENT } from "@/Urql/Query/Students/student.query";
import { GetAllStudentData } from "@/Urql/Types/Students/student.types";

const Header = () => {
    //Context
    const { variables } = useContext(PaginationContext);

    //Urql
    const [{ data }] = useQuery<GetAllStudentData>({
        query: GET_ALL_STUDENT,
        variables: {
            studentPramsInput: {
                name: variables.name,
                id: variables.id,
                class: variables.class,
                shift: variables.shift,
                section: variables.section,
                group: variables.group
            }
        }
    });

    return (
        <div className="mt-8">
            <div className="flex gap-8 items-center">
                <p className="text-base uppercase font-semibold">Student List</p>
                <div className="flex-1 text-right">
                    <ExportTable
                        data={data?.getAllStudent?.map((item) => ({ id: item.studentId, roll: item.roll, name: item.name, class: item.class?.name, section: item.section?.name, shift: item.shift?.name, group: item.group?.name, session: item.session })) as Array<any>}
                        headers={["ID", "Roll", "Name", "Class", "Section", "Shift", "Group", "Session"]}
                        fileName="Student List"
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;