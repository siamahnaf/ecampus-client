import { useState, useEffect } from "react";
import { Button, Select, Option } from "@material-tailwind/react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

//Components
import { Notification } from "@/Components/Common/Notification";
import Lists from "./Lists";

//Urql
import { useQuery } from "urql";
import { GET_ALL_CLASS } from "@/Urql/Query/Academics/class.query";
import { GetAllClassData } from "@/Urql/Types/Academics/class.types";
import { GET_ALL_EXAM } from "@/Urql/Query/Examination/exam.query";
import { GetAllExamsData } from "@/Urql/Types/Examination/exam.types";
import { GET_RESULT_LIST } from "@/Urql/Query/Examination/result.query";
import { GetResultsData } from "@/Urql/Types/Examination/result.types";

//Interface
interface Inputs {
    classId: string;
    shiftId: string;
    sectionId: string;
    groupId: string;
    examId: string;
    session: string;
}

const Add = () => {
    //State
    const [notification, setNotification] = useState(false);
    const [shift, setShift] = useState<{ id: string, name: string }[] | undefined>();
    const [section, setSection] = useState<{ id: string, name: string }[] | undefined>();
    const [group, setGroup] = useState<{ id: string, name: string }[] | undefined>();

    //Form Initializing
    const {
        formState: { errors },
        handleSubmit,
        getValues,
        control,
        watch
    } = useForm<Inputs>();

    //FormData
    const formData = watch();
    const formClassData = watch().classId

    //Graphql Hook
    const [classData] = useQuery<GetAllClassData>({ query: GET_ALL_CLASS });
    const [examData] = useQuery<GetAllExamsData>({ query: GET_ALL_EXAM });
    const [{ data, error, fetching }, refetch] = useQuery<GetResultsData>({
        query: GET_RESULT_LIST, variables: {
            resultPramsInput: {
                classId: formData.classId,
                shiftId: formData.shiftId,
                sectionId: formData.sectionId,
                groupId: formData.groupId,
                examId: formData.examId,
                session: formData.session
            }
        },
        pause: true
    });

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        refetch({ requestPolicy: "network-only" })
    }

    //Get current years list
    const getYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 15; i++) {
            years.push(currentYear - i);
        }
        return years;
    }

    //Lifecycle Hook
    useEffect(() => {
        if (error) {
            setNotification(true)
        }
    }, [error])

    useEffect(() => {
        if (formClassData) {
            const currentClass = classData.data?.getAllClass.find(item => item.id === formClassData)
            setShift(currentClass?.shift)
            setSection(currentClass?.section);
            setGroup(currentClass?.group);
        }
    }, [formClassData])

    return (
        <div className="mt-2">
            {error &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={"error"}
                >
                    {error?.message}
                </Notification>
            }
            <p className="text-lg font-semibold">Add Exam Result</p>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full p-5 border border-dashed border-textColor border-opacity-30 rounded-xl mt-5">
                <div className="grid grid-cols-2 gap-10">
                    <div>
                        <Controller
                            control={control}
                            name="classId"
                            key="class"
                            render={({ field: { onChange, value } }) => {
                                if (classData?.data && classData.data.getAllClass.length === 0) return (
                                    <Select
                                        label="Class"
                                        color="green"
                                        variant="standard"
                                        key="empty_class"
                                        onChange={(e) => onChange(e as string)}
                                    >
                                        <Option disabled>Please Add Some Class First</Option>
                                    </Select>
                                )
                                return (
                                    <Select
                                        label="Class"
                                        color="green"
                                        key="not_empty_class"
                                        variant="standard"
                                        value={value}
                                        onChange={(e) => onChange(e as string)}
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
                    <div>
                        <Controller
                            control={control}
                            name="shiftId"
                            key="shift"
                            render={({ field: { onChange, value } }) => {
                                if (!shift || shift.length === 0) return (
                                    <Select
                                        label="Shift"
                                        color="green"
                                        key="empty_shift"
                                        variant="standard"
                                        onChange={(e) => onChange(e as string)}
                                    >
                                        <Option disabled>{shift === undefined ? "Please select a class!" : "Not shift found!"}</Option>
                                    </Select>
                                )
                                return (
                                    <Select
                                        label="Shift"
                                        color="green"
                                        key="not_empty_shift"
                                        variant="standard"
                                        value={value}
                                        onChange={(e) => onChange(e as string)}
                                    >
                                        {shift.map((item, i) => (
                                            <Option key={i} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )
                            }}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="sectionId"
                            key="section"
                            render={({ field: { onChange, value } }) => {
                                if (!section || section.length === 0) return (
                                    <Select
                                        label="Section"
                                        color="green"
                                        key="empty_section"
                                        variant="standard"
                                        onChange={(e) => onChange(e as string)}

                                    >
                                        <Option disabled>{group === undefined ? "Please select a class" : "No section found!"}</Option>
                                    </Select>
                                )
                                return (
                                    <Select
                                        label="Section"
                                        color="green"
                                        key="not_empty_section"
                                        variant="standard"
                                        value={value}
                                        onChange={(e) => onChange(e as string)}
                                    >
                                        {section.map((item, i) => (
                                            <Option key={i} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )
                            }}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="groupId"
                            key="group"
                            render={({ field: { onChange, value } }) => {
                                if (!group || group.length === 0) return (
                                    <Select
                                        label="Group"
                                        color="green"
                                        variant="standard"
                                        key="empty_group"
                                        onChange={(e) => onChange(e as string)}
                                    >
                                        <Option disabled>{group === undefined ? "Please select a class" : "No group found!"}</Option>
                                    </Select>
                                )
                                return (
                                    <Select
                                        label="Group"
                                        color="green"
                                        key="not_empty_group"
                                        variant="standard"
                                        value={value}
                                        onChange={(e) => onChange(e as string)}
                                    >
                                        {group.map((item, i) => (
                                            <Option key={i} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )
                            }}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="examId"
                            key="exam"
                            render={({ field: { onChange, value } }) => {
                                if (!section || section.length === 0) return (
                                    <Select
                                        label="Select Exam"
                                        color="green"
                                        key="empty_exam"
                                        variant="standard"
                                        onChange={(e) => onChange(e as string)}
                                    >
                                        <Option disabled>Please add some exam first!</Option>
                                    </Select>
                                )
                                return (
                                    <Select
                                        label="Select Exam"
                                        color="green"
                                        key="not_empty_exam"
                                        variant="standard"
                                        value={value}
                                        onChange={(e) => onChange(e as string)}
                                    >
                                        {examData.data?.getAllExam.map((item, i) => (
                                            <Option key={i} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )
                            }}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="session"
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    label={"Session"}
                                    color="green"
                                    variant="standard"
                                    value={value}
                                    onChange={(e) => onChange(e as string)}
                                >
                                    {getYears().map((item, i) => (
                                        <Option key={i} value={item.toString()}>{item}</Option>
                                    ))}
                                </Select>
                            )}
                        />
                    </div>
                </div>
                <div className="mt-10 flex gap-2 items-center">
                    <div className="flex-1">
                        {fetching &&
                            <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                        }
                    </div>
                    <Button className="rounded-lg bg-main font-base py-2.5" type="submit" color="green">
                        Search
                    </Button>
                </div>
            </form>
            {data &&
                <Lists results={data.getResults} />
            }
        </div>
    );
};

export default Add;