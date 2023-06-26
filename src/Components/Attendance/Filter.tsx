import { useState, useEffect } from "react";
import { Input, Select, Option, Button } from "@material-tailwind/react";
import { UseFormRegister, UseFormWatch, Control, Controller, FieldErrors } from "react-hook-form";
import dayjs from "dayjs";
import { Datepicker, DateValueType } from "react-custom-datepicker-tailwind";
import { Icon } from "@iconify/react";

//Urql
import { useQuery } from "urql";
import { GET_ALL_CLASS } from "@/Urql/Query/Academics/class.query";
import { GetAllClassData } from "@/Urql/Types/Academics/class.types";

//Interface
export interface Inputs {
    class: string;
    shift: string;
    section: string;
    group: string;
    date: DateValueType;
}

interface Props {
    register: UseFormRegister<Inputs>,
    control: Control<Inputs>,
    fetching: boolean;
    watch: UseFormWatch<Inputs>;
    errors: FieldErrors<Inputs>;
}

const Filter = ({ register, watch, control, fetching, errors }: Props) => {
    const [shift, setShift] = useState<{ id: string, name: string }[] | undefined>();
    const [section, setSection] = useState<{ id: string, name: string }[] | undefined>();
    const [group, setGroup] = useState<{ id: string, name: string }[] | undefined>();

    //Urql
    const [classData] = useQuery<GetAllClassData>({ query: GET_ALL_CLASS });

    //Form Data
    const formData = watch().class;


    //Lifecycle Hook
    useEffect(() => {
        if (formData) {
            const currentClass = classData.data?.getAllClass.find(item => item.id === formData)
            setShift(currentClass?.shift)
            setSection(currentClass?.section);
            setGroup(currentClass?.group);
        }
    }, [formData])
    return (
        <div className="mt-2">
            <p className="text-lg font-semibold">Search Student</p>
            <div className="p-5 border border-dashed border-textColor border-opacity-30 rounded-xl mt-5">
                <div className="grid grid-cols-3 gap-8">
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
                                        key="not_empty_shift"
                                        variant="standard"
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
                                        key="empty_section"
                                        variant="standard"
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
                                        key="not_empty_section"
                                        variant="standard"
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
                                        key="empty_group"
                                        variant="standard"
                                        onChange={onChange}
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
                    <div>
                        <Controller
                            control={control}
                            name="date"
                            defaultValue={{ startDate: dayjs().format("YYYY-MM-DD"), endDate: dayjs().format("YYYY-MM-DD") }}
                            render={({ field: { onChange, value } }) => (
                                <Datepicker
                                    useRange={false}
                                    asSingle={true}
                                    value={value}
                                    onChange={onChange}
                                    primaryColor="green"
                                    customInput={
                                        <Input
                                            label="Date"
                                            variant="standard"
                                            color="green"
                                            icon={<Icon icon="uis:calender" />}
                                        />
                                    }
                                />
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
                    <Button className="rounded-lg bg-main font-base py-2.5" type="submit" color="green" disabled={fetching}>
                        Search
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Filter;