import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Checkbox } from "@material-tailwind/react";

//Components
import Filter, { Inputs } from "../Students/Filter";
import Promote from "./Promote";


//Graphql
import { useQuery, useMutation } from "urql";
import { GET_ALL_STUDENT } from "@/Urql/Query/Students/student.query";
import { GetAllStudentData } from "@/Urql/Types/Students/student.types";

const List = () => {
    //State
    const [selected, setSelected] = useState<string[]>([]);

    //Form
    const {
        register,
        handleSubmit,
        control,
        watch
    } = useForm<Inputs>();

    const formValues = watch();

    //Graphql Hook
    const [studentData, refetch] = useQuery<GetAllStudentData>({
        query: GET_ALL_STUDENT,
        variables: {
            studentPramsInput: {
                name: formValues.name || "",
                id: formValues.id || "",
                class: formValues.class || "",
                shift: formValues.shift || "",
                section: formValues.section || "",
                group: formValues.group || "",
            }
        },
        pause: true
    });

    //Handler
    const handleSingleSelect = (id: string) => {
        setSelected((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    }
    const handleAllSelect = () => {
        setSelected((prevSelected) => {
            if (prevSelected.length === 0 || prevSelected.length < (studentData.data?.getAllStudent.length || 0)) {
                return studentData.data?.getAllStudent.map((item) => item.id) as string[];
            } else {
                return [];
            }
        });
    }

    //OnSubmit
    const onSubmit: SubmitHandler<Inputs> = () => {
        setSelected([])
        refetch({ requestPolicy: "network-only" })
    }

    return (
        <div className="mb-10">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Filter
                    register={register}
                    control={control}
                    fetching={studentData.fetching}
                    watch={watch}
                />
            </form>
            {studentData.data &&
                <div>
                    <h2 className="my-6 text-base font-semibold uppercase">Promote</h2>
                    <div className="mt-8 overflow-x-auto">
                        <table className="table table-compact w-full">
                            <thead>
                                <tr>
                                    <th className="bg-primary capitalize text-main font-medium">
                                        <Checkbox
                                            color="green"
                                            className="w-3.5 h-3.5 rounded-sm"
                                            onChange={handleAllSelect}
                                            checked={selected.length === studentData.data.getAllStudent.length}
                                        />
                                    </th>
                                    <th className="bg-primary capitalize text-main font-medium">Student Id</th>
                                    <th className="bg-primary capitalize text-main font-medium">Roll</th>
                                    <th className="bg-primary capitalize text-main font-medium">Name</th>
                                    <th className="bg-primary capitalize text-main font-medium">Class</th>
                                    <th className="bg-primary capitalize text-main font-medium">Section</th>
                                    <th className="bg-primary capitalize text-main font-medium">Shift</th>
                                    <th className="bg-primary capitalize text-main font-medium">Group</th>
                                    <th className="bg-primary capitalize text-main font-medium">Session</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentData.data?.getAllStudent.map((item, i) => (
                                    <tr key={i}>
                                        <td>
                                            <Checkbox
                                                color="green"
                                                className="w-3.5 h-3.5 rounded-sm"
                                                onChange={() => handleSingleSelect(item.id)}
                                                checked={selected.includes(item.id)}
                                            />
                                        </td>
                                        <td>{item.studentId}</td>
                                        <td>{item.roll}</td>
                                        <td>{item.name}</td>
                                        <td>{item.class?.name}</td>
                                        <td>{item.section?.name}</td>
                                        <td>{item.shift?.name}</td>
                                        <td>{item.group?.name}</td>
                                        <td>{item.session}</td>
                                    </tr>
                                ))}
                                {studentData.data?.getAllStudent.length === 0 &&
                                    <tr>
                                        <td colSpan={9} className="text-center text-main font-medium text-base py-4">
                                            No student data found!
                                        </td>
                                    </tr>
                                }
                                {studentData.error &&
                                    <tr>
                                        <td colSpan={9} className="text-center text-main font-medium text-base py-4">
                                            {studentData.error?.message}
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <Promote selected={selected} />
                </div>
            }
        </div>
    );
};

export default List;