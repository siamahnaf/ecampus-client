import { useEffect, useState, useContext } from "react";
import { Dialog, Input, DialogHeader, DialogBody, DialogFooter, Button, Select, Option, Textarea } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

//Components
import { Notification } from "@/Components/Common/Notification";

//Context
import { PaginationContext } from "@/Context/pagination.context";

//Urql
import { useMutation, useQuery } from "urql";
import { UPDATE_EXAM, GET_EXAM_LIST, GET_ALL_EXAM } from "@/Urql/Query/Examination/exam.query";
import { UpdateExamData, GetExamsData, GetAllExamsData, ExamData } from "@/Urql/Types/Examination/exam.types";
import { GET_GRADE_SYSTEM } from "@/Urql/Query/Examination/grade.query";
import { GetGradesData } from "@/Urql/Types/Examination/grade.types";

//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    defaultValue: ExamData
}
interface Inputs {
    name: string;
    type: string;
    description: string;
}

const Edit = ({ open, onClose, defaultValue }: Props) => {
    //State
    const [notification, setNotification] = useState(false);

    //Context
    const { variables } = useContext(PaginationContext);

    //Urql
    const [{ data, error, fetching }, updateList] = useMutation<UpdateExamData>(UPDATE_EXAM);
    const [_, refetch] = useQuery<GetExamsData>({
        query: GET_EXAM_LIST,
        variables: { searchInput: variables },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllExamsData>({ query: GET_ALL_EXAM, pause: true });
    const [grades] = useQuery<GetGradesData>({ query: GET_GRADE_SYSTEM, variables: { searchInput: { search: "" } } });

    //UseForm
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        control
    } = useForm<Inputs>({
        defaultValues: {
            name: defaultValue.name,
            type: defaultValue.type.id,
            description: defaultValue.description
        }
    });

    //On Submit Handler
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        updateList({ examInput: value, updateExamId: defaultValue.id }).then(({ data }) => {
            setNotification(true);
            refetch({ requestPolicy: "network-only" })
            refetchAll({ requestPolicy: "network-only" })
            if (data?.updateExam.success) {
                onClose()
            }
        })
    }

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Lifecycle Hook
    useEffect(() => {
        reset({
            name: defaultValue.name,
            type: defaultValue.type.id,
            description: defaultValue.description
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue])

    return (
        <div>
            {(error || data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={error?.message ? "error" : "success"}
                >
                    {error?.message ?? data?.updateExam.message}
                </Notification>
            }
            <Dialog
                open={open}
                handler={onClose}
                animate={{
                    mount: { y: 0 },
                    unmount: { y: -15 },
                }}
                size="xl"
                style={{ fontFamily: inter.style.fontFamily }}
                className="rounded-lg"
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader className="text-xl">
                        Edit {defaultValue.name}
                    </DialogHeader>
                    <DialogBody className="py-6">
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
                    </DialogBody>
                    <DialogFooter className="flex gap-3">
                        <div className="flex-1">
                            {fetching &&
                                <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                            }
                        </div>
                        <Button variant="outlined" color="green" size="sm" onClick={onClose} className="focus:right-0">Cancel</Button>
                        <Button color="green" size="sm" className="bg-main px-6" type="submit" disabled={fetching}>
                            Save Exam
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </div>
    );
};

export default Edit;