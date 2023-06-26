import { useState, useEffect } from "react"
import { Select, Option, Button, Radio } from "@material-tailwind/react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Icon } from "@iconify/react";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, useQuery } from "urql";
import { PROMOTE_STUDENT } from "@/Urql/Query/Students/student.query";
import { PromoteStudentData } from "@/Urql/Types/Students/student.types";
import { GET_ALL_CLASS } from "@/Urql/Query/Academics/class.query";
import { GetAllClassData } from "@/Urql/Types/Academics/class.types";


//Interface
interface Inputs {
    class: string;
    section: string;
    group: string;
    shift: string;
    markAs: string;
}
interface Props {
    selected: string[];
}


const Promote = ({ selected }: Props) => {
    //State
    const [tab, setTab] = useState<"promote" | "other">("promote");
    const [customError, setError] = useState<string>("")
    const [shift, setShift] = useState<{ id: string, name: string }[] | undefined>();
    const [section, setSection] = useState<{ id: string, name: string }[] | undefined>();
    const [group, setGroup] = useState<{ id: string, name: string }[] | undefined>();
    const [notification, setNotification] = useState<boolean>(false);

    //Urql
    const [classData] = useQuery<GetAllClassData>({ query: GET_ALL_CLASS });
    const [{ data, error, fetching }, promoteStudent] = useMutation<PromoteStudentData>(PROMOTE_STUDENT);

    //Initialize Form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        control
    } = useForm<Inputs>();

    //formData
    const formData = watch().class


    //Form Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        if (selected.length === 0) {
            setError("Please select some students!")
            setNotification(true)
        } else {
            const promoteData = {
                ...value,
                ids: selected
            }
            console.log(promoteData)
            promoteStudent({ promoteInput: promoteData }).then(() => {
                setNotification(true)
            })
        }
    }

    //Handler
    const onTabHandler = (v: "promote" | "other") => {
        setTab(v)
        reset()
    }

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Lifecycle Hook
    useEffect(() => {
        if (formData) {
            const currentClass = classData.data?.getAllClass.find(item => item.id === formData)
            setShift(currentClass?.shift)
            setSection(currentClass?.section);
            setGroup(currentClass?.group);
        }
    }, [formData])

    useEffect(() => {
        if (selected.length > 0) {
            setError("")
        }
    }, [selected])

    return (
        <form className="p-5 border border-dashed border-textColor border-opacity-30 rounded-xl mt-10" onSubmit={handleSubmit(onSubmit)}>
            {(error || data) &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity={error?.message ? "error" : "success"}
                >
                    {error?.message ?? data?.promoteStudent.message}
                </Notification>
            }
            <div className="flex gap-4 mb-10">
                <button type="button" className={`text-sm font-medium px-3 py-1 rounded-md ${tab === "promote" ? "bg-main text-white" : "bg-primary text-black"}`} onClick={() => onTabHandler("promote")}>Promote to</button>
                <button type="button" className={`text-sm font-medium px-3 py-1 rounded-md ${tab === "other" ? "bg-main text-white" : "bg-primary text-black"}`} onClick={() => onTabHandler("other")}>Others</button>
            </div>
            {tab === "promote" &&
                <div className="grid grid-cols-4 gap-10">
                    <div>
                        <Controller
                            control={control}
                            name="class"
                            key="class"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => {
                                if (classData?.data && classData.data.getAllClass.length === 0) return (
                                    <Select
                                        label="Class"
                                        color="green"
                                        variant="standard"
                                        key="empty_class"
                                        onChange={onChange}
                                        error={errors.class ? true : false}
                                    >
                                        <Option disabled>Please Add Some Class First</Option>
                                    </Select>
                                )
                                return (
                                    <Select
                                        label="Class"
                                        color="green"
                                        variant="standard"
                                        key="not_empty_class"
                                        value={value}
                                        onChange={onChange}
                                        error={errors.class ? true : false}
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
                            name="shift"
                            key="shift"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => {
                                if (!shift || shift.length === 0) return (
                                    <Select
                                        label="Shift"
                                        color="green"
                                        variant="standard"
                                        key="empty_shift"
                                        onChange={onChange}
                                        error={errors.shift ? true : false}
                                    >
                                        <Option disabled>{shift === undefined ? "Please select a class!" : "Not shift found!"}</Option>
                                    </Select>
                                )
                                return (
                                    <Select
                                        label="Shift"
                                        color="green"
                                        variant="standard"
                                        key="not_empty_shift"
                                        value={value}
                                        onChange={onChange}
                                        error={errors.shift ? true : false}
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
                            name="section"
                            key="section"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => {
                                if (!section || section.length === 0) return (
                                    <Select
                                        label="Section"
                                        color="green"
                                        variant="standard"
                                        key="empty_section"
                                        onChange={onChange}
                                        error={errors.section ? true : false}

                                    >
                                        <Option disabled>{group === undefined ? "Please select a class" : "No section found!"}</Option>
                                    </Select>
                                )
                                return (
                                    <Select
                                        label="Section"
                                        color="green"
                                        variant="standard"
                                        key="not_empty_section"
                                        value={value}
                                        onChange={onChange}
                                        error={errors.section ? true : false}
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
                            name="group"
                            key="group"
                            defaultValue=""
                            render={({ field: { onChange, value } }) => {
                                if (!group || group.length === 0) return (
                                    <Select
                                        label="Group"
                                        color="green"
                                        variant="standard"
                                        key="empty_group"
                                        onChange={onChange}
                                    >
                                        <Option disabled>{group === undefined ? "Please select a class" : "No group found!"}</Option>
                                    </Select>
                                )
                                return (
                                    <Select
                                        label="Group"
                                        color="green"
                                        variant="standard"
                                        key="not_empty_group"
                                        value={value}
                                        onChange={onChange}
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
                </div>
            }
            {tab === "other" &&
                <div className="grid grid-cols-1 gap-1">
                    <div>
                        <Radio
                            id="markAsCompleted"
                            label="Mark as completed"
                            color="green"
                            className="rounded-sm p-0 w-4 h-4"
                            value="completed"
                            {...register("markAs")}
                            icon={
                                <Icon icon="material-symbols:check-box" className="text-xl" />
                            }
                            labelProps={{
                                className: "text-base font-medium opacity-100"
                            }}
                        />
                    </div>
                    <div>
                        <Radio
                            id="markAsLeave"
                            label="Mark as completed"
                            color="green"
                            className="rounded-sm p-0 w-4 h-4"
                            value="left"
                            {...register("markAs")}
                            icon={
                                <Icon icon="material-symbols:check-box" className="text-xl" />
                            }
                            labelProps={{
                                className: "text-base font-medium opacity-100"
                            }}
                        />
                    </div>
                </div>
            }
            <div className="mt-10 flex gap-2 items-center">
                <div className="flex-1">
                    {fetching &&
                        <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                    }
                </div>
                <Button className="rounded-lg bg-main font-base py-2.5" type="submit" color="green" disabled={fetching}>
                    Promote
                </Button>
            </div>
            {customError &&
                <p className="text-right text-sm mt-2 text-red-600 font-medium">Please select some student first!</p>
            }
        </form>
    );
};

export default Promote;