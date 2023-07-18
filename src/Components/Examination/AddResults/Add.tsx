import { useState, useEffect } from "react";
import { Button, Select, Option } from "@material-tailwind/react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

//Components
import { Notification } from "@/Components/Common/Notification";
import Results from "./Results";

//Graphql
import { useMutation, useQuery } from "urql";
import { GET_ALL_CLASS } from "@/Urql/Query/Academics/class.query";
import { GetAllClassData } from "@/Urql/Types/Academics/class.types";
import { GET_ALL_SUBJECTS } from "@/Urql/Query/Academics/subject.query";
import { GetAllSubjectData } from "@/Urql/Types/Academics/subject.types";
import { GET_ALL_EXAM } from "@/Urql/Query/Examination/exam.query";
import { GetAllExamsData } from "@/Urql/Types/Examination/exam.types";
import { GET_SUBJECT_RESULT } from "@/Urql/Query/Examination/result.query";
import { GetSubjectResultData } from "@/Urql/Types/Examination/result.types";

//Interface
interface Inputs {
    classId: string;
    shiftId: string;
    sectionId: string;
    groupId: string;
    examId: string;
    subjectId: string;
    session: string;
}

const Add = () => {
    //State
    const [notification, setNotification] = useState(false);
    const [shift, setShift] = useState<{ id: string, name: string }[] | undefined>();
    const [section, setSection] = useState<{ id: string, name: string }[] | undefined>();
    const [group, setGroup] = useState<{ id: string, name: string }[] | undefined>();

    //Graphql Hook
    const [classData] = useQuery<GetAllClassData>({ query: GET_ALL_CLASS });
    const [subjectData] = useQuery<GetAllSubjectData>({ query: GET_ALL_SUBJECTS });
    const [examData] = useQuery<GetAllExamsData>({ query: GET_ALL_EXAM });
    const [{ data, error, fetching }, getSub] = useMutation<GetSubjectResultData>(GET_SUBJECT_RESULT);

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Form Initializing
    const {
        formState: { errors },
        handleSubmit,
        control,
        watch
    } = useForm<Inputs>();

    //Form Data
    const formData = watch().classId;

    //Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        getSub({ resultSearchInput: value })
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
        if (formData) {
            const currentClass = classData.data?.getAllClass.find(item => item.id === formData)
            setShift(currentClass?.shift)
            setSection(currentClass?.section);
            setGroup(currentClass?.group);
        }
    }, [formData])

    return (
        <div className="mt-2 mb-10">
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
                <div className="grid grid-cols-3 gap-10">
                    <div>
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
                                        variant="standard"
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
                                        variant="standard"
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
                    <div>
                        <Controller
                            control={control}
                            name="shiftId"
                            key="shift"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => {
                                if (!shift || shift.length === 0) return (
                                    <Select
                                        label="Shift"
                                        color="green"
                                        key="empty_shift"
                                        variant="standard"
                                        onChange={(e) => onChange(e as string)}
                                        error={errors.shiftId ? true : false}
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
                                        error={errors.shiftId ? true : false}
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
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => {
                                if (!section || section.length === 0) return (
                                    <Select
                                        label="Section"
                                        color="green"
                                        key="empty_section"
                                        variant="standard"
                                        onChange={(e) => onChange(e as string)}
                                        error={errors.sectionId ? true : false}

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
                                        error={errors.sectionId ? true : false}
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
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => {
                                if (!section || section.length === 0) return (
                                    <Select
                                        label="Select Exam"
                                        color="green"
                                        key="empty_exam"
                                        variant="standard"
                                        onChange={(e) => onChange(e as string)}
                                        error={errors.examId ? true : false}

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
                                        error={errors.examId ? true : false}
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
                            name="subjectId"
                            key="subject"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => {
                                if (!section || section.length === 0) return (
                                    <Select
                                        label="Select Subject"
                                        color="green"
                                        variant="standard"
                                        key="empty_subject"
                                        onChange={(e) => onChange(e as string)}
                                        error={errors.subjectId ? true : false}

                                    >
                                        <Option disabled>Please add some subject first!</Option>
                                    </Select>
                                )
                                return (
                                    <Select
                                        label="Select Subject"
                                        color="green"
                                        key="not_empty_subject"
                                        variant="standard"
                                        value={value}
                                        onChange={(e) => onChange(e as string)}
                                        error={errors.subjectId ? true : false}
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
                    <div>
                        <Controller
                            control={control}
                            name="session"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    label={"Session"}
                                    color="green"
                                    variant="standard"
                                    value={value}
                                    onChange={(e) => onChange(e as string)}
                                    error={errors.session ? true : false}
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
                <Results
                    results={data.getSubjectResult}
                />
            }
        </div>
    );
};

export default Add;