import { useState, useContext, ChangeEvent, useEffect } from "react";
import { Input, Button, Select, Option, Checkbox } from "@material-tailwind/react";
import { useForm, SubmitHandler, Controller, useFieldArray } from "react-hook-form";

//Context
import { PaginationContext, defaultVariable } from "@/Context/pagination.context";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, useQuery } from "urql";
import { ADD_CONF, GET_CONF_LIST, GET_ALL_CONFS } from "@/Urql/Query/Examination/conf.query";
import { AddConfData, GetConfData, GetAllConfData } from "@/Urql/Types/Examination/conf.types";
import { GET_ALL_CLASS } from "@/Urql/Query/Academics/class.query";
import { GetAllClassData } from "@/Urql/Types/Academics/class.types";
import { GET_ALL_SUBJECTS } from "@/Urql/Query/Academics/subject.query";
import { GetAllSubjectData } from "@/Urql/Types/Academics/subject.types";
import { GET_ALL_EXAM } from "@/Urql/Query/Examination/exam.query";
import { GetAllExamsData } from "@/Urql/Types/Examination/exam.types";


//Interface
interface Inputs {
    classId: string;
    examId: string[];
    subjects: {
        totalMarks: string;
        subjectId: string;
    }[];
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
        control,
        getValues,
        watch,
        setValue
    } = useForm<Inputs>({
        defaultValues: {
            examId: [],
            subjects: [{ totalMarks: "", subjectId: "" }]
        }
    });

    //Form Data
    const formData = watch();

    //Urql
    const [{ data, error, fetching }, addList] = useMutation<AddConfData>(ADD_CONF);
    const [_, refetch] = useQuery<GetConfData>({
        query: GET_CONF_LIST,
        variables: { searchInput: defaultVariable },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllConfData>({ query: GET_ALL_CONFS, pause: true });
    const [classData] = useQuery<GetAllClassData>({ query: GET_ALL_CLASS });
    const [subjectData] = useQuery<GetAllSubjectData>({ query: GET_ALL_SUBJECTS });
    const [examData] = useQuery<GetAllExamsData>({ query: GET_ALL_EXAM });

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Handler
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target;
        const oldData = getValues("examId");
        if (checked) {
            setValue("examId", [...oldData || [], value]);
        } else {
            const newValue = oldData?.filter(item => item !== value);
            setValue("examId", newValue || []);
        }
    };

    //Use Field array
    const { fields, append, remove } = useFieldArray({
        control,
        name: "subjects"
    });

    //Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        addList({ confInput: value }).then(({ data }) => {
            if (data?.addConf.success) {
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

    useEffect(() => {
        register("examId", { required: true })

    }, [])

    return (
        <div className="mt-2">
            {(error || data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={error?.message ? "error" : "success"}
                >
                    {error?.message ?? data?.addConf.message}
                </Notification>
            }
            <p className="text-lg font-semibold">Add Configuration</p>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full p-5 border border-dashed border-textColor border-opacity-30 rounded-xl mt-5">
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <h4 className="text-base font-medium mb-2">Class</h4>
                        <Controller
                            control={control}
                            name="classId"
                            key="class"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => {
                                if (classData?.data && classData.data.getAllClass.length === 0) return (
                                    <Select
                                        label="Class"
                                        color="green"
                                        key="empty_class"
                                        onChange={(e) => onChange(e as string)}
                                        error={errors.classId ? true : false}
                                    >
                                        <Option disabled>Please Add Some Class First</Option>
                                    </Select>
                                )
                                return (
                                    <Select
                                        label="Class"
                                        color="green"
                                        key="not_empty_class"
                                        value={value}
                                        onChange={(e) => onChange(e as string)}
                                        error={errors.classId ? true : false}
                                    >
                                        {classData.data?.getAllClass.map((item, i) => (
                                            <Option key={i} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )
                            }}
                        />
                    </div>
                    <div className="col-start-1 col-span-2">
                        <h4 className={`text-base font-medium mb-2 ${errors.examId && "text-red-600"}`}>Select Exam*</h4>
                        <div className="grid grid-cols-4 gap-3">
                            {examData.data && examData.data.getAllExam.length > 0 ? examData.data?.getAllExam.map((item, i) => (
                                <div key={i}>
                                    <Checkbox
                                        label={item.name}
                                        id={item.name + i}
                                        value={item.id}
                                        color="green"
                                        className="w-4 h-4 rounded-sm"
                                        labelProps={{ className: "font-medium text-[15px] text-textColor" }}
                                        readOnly
                                        onChange={onChange}
                                        checked={formData?.examId.some(a => a === item.id)}
                                    />
                                </div>
                            )) : (<p className="text-base opacity-50 my-3">Please add some exam first!</p>)}
                        </div>
                    </div>
                    <div className="col-start-1 col-span-2">
                        <h4 className="text-base font-medium mb-2">Select Subject</h4>
                        <button onClick={() => append({ totalMarks: "", subjectId: "" })} className="text-sm text-main font-medium mt-4" type="button">
                            <span className="mr-1">+</span> Add More
                        </button>
                        {fields.map((_, i) => (
                            <div key={i} className="my-3">
                                <div key={i} className="grid grid-cols-7 gap-5">
                                    <div className="col-span-3">
                                        <Controller
                                            control={control}
                                            name={`subjects.${i}.subjectId`}
                                            key={"subject" + i.toString()}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, value } }) => {
                                                if (subjectData?.data && subjectData.data.getAllSubject.length === 0) return (
                                                    <Select
                                                        label="Select Subject"
                                                        color="green"
                                                        key={"empty_subject" + i.toString()}
                                                        onChange={(e) => onChange(e as string)}
                                                        error={(errors.subjects && errors.subjects[i]?.totalMarks) ? true : false}
                                                    >
                                                        <Option disabled>Please Add Some Class First</Option>
                                                    </Select>
                                                )
                                                return (
                                                    <Select
                                                        label="Select Subject"
                                                        color="green"
                                                        key={"not_empty_subject" + i.toString()}
                                                        value={value}
                                                        onChange={(e) => onChange(e as string)}
                                                        error={(errors.subjects && errors.subjects[i]?.totalMarks) ? true : false}
                                                    >
                                                        {subjectData.data?.getAllSubject.map((item, i) => (
                                                            <Option key={i} value={item.id}>
                                                                {item.name}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                )
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <Input
                                            label="Full Marks"
                                            color="green"
                                            error={(errors.subjects && errors.subjects[i]?.totalMarks) ? true : false}
                                            {...register(`subjects.${i}.totalMarks`, { required: true })}
                                            onInput={(e: ChangeEvent<HTMLInputElement>) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, '')
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-right">
                                        <button className="text-xs text-red-600" onClick={() => remove(i)} disabled={fields.length <= 1}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-10 flex gap-2 items-center">
                    <div className="flex-1">
                        {fetching &&
                            <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                        }
                    </div>
                    <Button className="rounded-lg bg-main font-base py-2.5" type="submit" color="green" disabled={fetching}>
                        Save Configuration
                    </Button>
                </div>
            </form >
        </div >
    );
};

export default Add;