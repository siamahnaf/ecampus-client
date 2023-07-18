import { useState, useContext } from "react";
import { Input, Button, Select, Option, Textarea } from "@material-tailwind/react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

//Context
import { PaginationContext, defaultVariable } from "@/Context/pagination.context";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, useQuery } from "urql";
import { ADD_EXAM, GET_EXAM_LIST, GET_ALL_EXAM } from "@/Urql/Query/Examination/exam.query";
import { AddExamData, GetExamsData, GetAllExamsData } from "@/Urql/Types/Examination/exam.types";
import { GET_GRADE_SYSTEM } from "@/Urql/Query/Examination/grade.query";
import { GetGradesData } from "@/Urql/Types/Examination/grade.types";

//Interface
interface Inputs {
    name: string;
    type: string;
    description: string;
}

const Add = () => {
    //State
    const [notification, setNotification] = useState(false);

    //Context
    const { setVariables, variables, setPolicy } = useContext(PaginationContext);

    //Form Initializing
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        control
    } = useForm<Inputs>();

    //Urql
    const [{ data, error, fetching }, addList] = useMutation<AddExamData>(ADD_EXAM);
    const [_, refetch] = useQuery<GetExamsData>({
        query: GET_EXAM_LIST,
        variables: { searchInput: defaultVariable },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllExamsData>({ query: GET_ALL_EXAM, pause: true });
    const [grades] = useQuery<GetGradesData>({ query: GET_GRADE_SYSTEM, variables: { searchInput: { search: "" } } });

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        addList({ examInput: value }).then(({ data }) => {
            if (data?.addExam.success) {
                if (variables.page > 1) {
                    setPolicy?.("network-only")
                    setVariables?.(prev => ({ ...prev, page: 1 }))
                } else {
                    refetch({ requestPolicy: "network-only" })
                }
                refetchAll({ requestPolicy: "network-only" })
                reset()
            }
            setNotification(true);
        })
    }
    return (
        <div className="mt-2">
            {(error || data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={error?.message ? "error" : "success"}
                >
                    {error?.message ?? data?.addExam.message}
                </Notification>
            }
            <p className="text-lg font-semibold">Add Exam</p>
            <form onSubmit={handleSubmit(onSubmit)} className="w-[70%] p-5 border border-dashed border-textColor border-opacity-30 rounded-xl mt-5">
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <Input
                            label="Exam Name"
                            color="green"
                            variant="standard"
                            error={errors.name ? true : false}
                            {...register("name", { required: true })}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="type"
                            key="type"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => {
                                if (grades?.data && grades.data.getGrades.length === 0) return (
                                    <Select
                                        label="Exam Type"
                                        color="green"
                                        variant="standard"
                                        key="empty_key"
                                        onChange={(e) => onChange(e as string)}
                                        error={errors.type ? true : false}
                                    >
                                        <Option disabled>Please add grade system first!</Option>
                                    </Select>
                                )
                                return (
                                    <Select
                                        label="Exam Type"
                                        color="green"
                                        variant="standard"
                                        key="not_empty_key"
                                        value={value}
                                        onChange={(e) => onChange(e as string)}
                                        error={errors.type ? true : false}
                                    >
                                        {grades.data?.getGrades.map((item, i) => (
                                            <Option key={i} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )
                            }}
                        />
                    </div>
                    <div className="col-span-2">
                        <Textarea
                            label="Description"
                            color="green"
                            variant="standard"
                            {...register("description")}
                            rows={3}
                        />
                    </div>
                </div>
                <div className="mt-10 flex gap-2 items-center">
                    <div className="flex-1">
                        {fetching &&
                            <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                        }
                    </div>
                    <Button className="rounded-lg bg-main font-base py-2.5" type="submit" color="green" disabled={fetching}>
                        Save Exam
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Add;