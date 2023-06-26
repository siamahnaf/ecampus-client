import { useState, useContext } from "react";
import { Icon } from "@iconify/react";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";

//Context
import { PaginationContext } from "@/Context/student-pagination.context";

//Components
import { Notification } from "@/Components/Common/Notification";
import Pagination from "@/Components/Common/Pagination";
import Confirm from "@/Components/Common/Confirm";
import Filter, { Inputs } from "./Filter";
import Header from "./Header";

//Urql
import { useMutation, useQuery } from "urql";
import { GET_STUDENT_LIST, DELETE_STUDENT, GET_ALL_STUDENT } from "@/Urql/Query/Students/student.query";
import { GetStudentListData, DeleteStudentData, GetAllStudentData } from "@/Urql/Types/Students/student.types";

const Lists = () => {
    //State
    const [notification, setNotification] = useState<boolean>(false);
    const [confirm, setConfirm] = useState<string | null>(null);

    //Context
    const { setVariables, variables, policy, setPolicy } = useContext(PaginationContext);

    //Urql
    const [{ data, error, fetching }, refetch] = useQuery<GetStudentListData>({
        query: GET_STUDENT_LIST,
        variables: { studentPaginationInput: variables },
        requestPolicy: policy
    });
    const [deleteData, deleteList] = useMutation<DeleteStudentData>(DELETE_STUDENT);
    const [__, refetchAll] = useQuery<GetAllStudentData>({
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

    //Form
    const {
        register,
        handleSubmit,
        watch,
        control
    } = useForm<Inputs>();



    //OnSubmit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        setVariables?.(prev => ({ ...prev, ...value }))
    }

    //On DeleteHandler 
    const onDeleteConfirm = (id: string) => {
        deleteList({ deleteStudentId: id }).then(() => {
            refetch({ requestPolicy: "network-only" })
            refetchAll({ requestPolicy: "network-only" })
            setNotification(true)
        })
    }

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };
    return (
        <div className="mb-8">
            {(deleteData.error || deleteData.data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={deleteData.error?.message ? "error" : "success"}
                >
                    {deleteData.error?.message ?? deleteData.data?.deleteStudent.message}
                </Notification>
            }
            <form onSubmit={handleSubmit(onSubmit)}>
                <Filter
                    register={register}
                    watch={watch}
                    control={control}
                    fetching={fetching}
                />
            </form>
            <Header />
            <div className="mt-8 overflow-x-auto">
                <table className="table table-compact w-full">
                    <thead>
                        <tr>
                            <th className="bg-primary capitalize text-main font-medium">ID</th>
                            <th className="bg-primary capitalize text-main font-medium">Roll</th>
                            <th className="bg-primary capitalize text-main font-medium">Name</th>
                            <th className="bg-primary capitalize text-main font-medium">Class</th>
                            <th className="bg-primary capitalize text-main font-medium">Section</th>
                            <th className="bg-primary capitalize text-main font-medium">Shift</th>
                            <th className="bg-primary capitalize text-main font-medium">Group</th>
                            <th className="bg-primary capitalize text-main font-medium">Session</th>
                            <th className="bg-primary capitalize text-main font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.getStudents.results.map((item, i) => (
                            <tr key={i}>
                                <td>{item.studentId}</td>
                                <td>{item.roll}</td>
                                <td>{item.name}</td>
                                <td>{item.class?.name}</td>
                                <td>{item.section?.name}</td>
                                <td>{item.shift?.name}</td>
                                <td>{item.group?.name}</td>
                                <td>{item.session}</td>
                                <td className="flex gap-3">
                                    <div className="tooltip" data-tip="Details">
                                        <Link href={`/students/profile/${item.name.toLowerCase().replace(/\s+/g, "-")}?id=${item.id}`}>
                                            <button className="text-main">
                                                <Icon icon="mingcute:eye-2-fill" className="text-xl" />
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="tooltip" data-tip="Edit">
                                        <Link href={`/students/edit-student/${item.name.toLowerCase().replace(/\s+/g, "-")}?id=${item.id}`}>
                                            <button className="text-blue-600">
                                                <Icon icon="material-symbols:edit-document" className="text-xl" />
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="tooltip" data-tip="Delete">
                                        <button className="text-red-500" onClick={() => setConfirm(item.id)}>
                                            <Icon icon="ic:round-delete" className="text-xl" />
                                        </button>
                                        <Confirm
                                            open={confirm === item.id}
                                            onClose={() => setConfirm(null)}
                                            fetching={deleteData.fetching}
                                            id={item.id}
                                            onConfirm={(id) => onDeleteConfirm(id)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data?.getStudents.results.length === 0 &&
                            <tr>
                                <td colSpan={9} className="text-center text-main font-medium text-base py-4">
                                    No student data found!
                                </td>
                            </tr>
                        }
                        {error &&
                            <tr>
                                <td colSpan={9} className="text-center text-main font-medium text-base py-4">
                                    {error?.message}
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <div className="mt-5">
                <Pagination
                    onNextClick={() => {
                        setPolicy?.("network-only")
                        setVariables?.(prev => ({ ...prev, page: data?.getStudents.meta.currentPage as number + 1 }))
                    }}
                    onPrevClick={() => {
                        setPolicy?.("network-only")
                        setVariables?.(prev => ({ ...prev, page: data?.getStudents.meta.currentPage as number - 1 }))
                    }}
                    onSetPage={(e) => setVariables?.(prev => ({ ...prev, page: e }))}
                    meta={data?.getStudents.meta}
                />
            </div>
        </div>
    );
};

export default Lists;