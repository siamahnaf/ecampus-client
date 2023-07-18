import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Icon } from "@iconify/react";

//Component
import ExportTable from "@/Components/Common/ExportTable";

//Urql
import { useQuery } from "urql";
import { GET_GRADE_SYSTEM } from "@/Urql/Query/Examination/grade.query";
import { GetGradesData } from "@/Urql/Types/Examination/grade.types";

//Interface
interface Props {
    value: string;
    setValue: Dispatch<SetStateAction<string>>
}

const Header = ({ value, setValue }: Props) => {
    //Urql
    const [{ data }] = useQuery<GetGradesData>({ query: GET_GRADE_SYSTEM, variables: { searchInput: { search: value } } });

    //OnChange Handler
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    return (
        <div className="mt-8">
            <div className="flex gap-8 items-center">
                <p className="text-base uppercase font-semibold">Grade List</p>
                <div className="relative w-1/2">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input w-full rounded-3xl input-sm bg-textColor bg-opacity-5 focus:outline-none pl-14 py-[18px]"
                        onChange={onChange}
                    />
                    <Icon icon="material-symbols:search" className="text-xl absolute top-2/4 left-6 -translate-y-2/4" />
                </div>
                <div className="flex-1 text-right">
                    <ExportTable
                        data={data?.getGrades.map((item) => ({ title: item.name, gradeName: item.grades.map((item) => item.name).join(", "), range: `${item.grades.map((item) => item.percent_from).join(", ")} to ${item.grades.map((item) => item.percent_upto).join(", ")}`, gradePont: item.grades.map((item) => item.grade_point).join(", "), createdBy: item.createdBy.name || item.createdBy.phone })) as Array<any>}
                        headers={["Title", "Grade Name", "Grade Range", "Grade Point", "Created By"]}
                        fileName="Grade List"
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;