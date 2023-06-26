import { useState, useContext } from "react";
import { Input, Button, Checkbox } from "@material-tailwind/react";
import { useForm, SubmitHandler } from "react-hook-form";

//Context
import { PaginationContext, defaultVariable } from "@/Context/pagination.context";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, useQuery } from "urql";
import { ADD_CLASS, GET_CLASS_LIST, GET_ALL_CLASS } from "@/Urql/Query/Academics/class.query";
import { AddClassData, GetClassListData, GetAllClassData } from "@/Urql/Types/Academics/class.types";
import { GET_ALL_SECTIONS } from "@/Urql/Query/Academics/section.query";
import { GetAllSectionData } from "@/Urql/Types/Academics/section.types";
import { GET_ALL_SHIFT } from "@/Urql/Query/Academics/shift.query";
import { GetAllShiftData } from "@/Urql/Types/Academics/shift.types";
import { GET_ALL_GROUP } from "@/Urql/Query/Academics/group.query";
import { GetAllGroupData } from "@/Urql/Types/Academics/group.types";

//Interface
interface Inputs {
    name: string;
    section: string[];
    group: string[];
    shift: string[];
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
        reset
    } = useForm<Inputs>({ defaultValues: { section: [], group: [], shift: [] } });

    //Urql
    const [{ data, error, fetching }, addList] = useMutation<AddClassData>(ADD_CLASS);
    const [_, refetch] = useQuery<GetClassListData>({
        query: GET_CLASS_LIST,
        variables: { searchInput: defaultVariable },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllClassData>({ query: GET_ALL_CLASS, pause: true });
    const [sectionData] = useQuery<GetAllSectionData>({ query: GET_ALL_SECTIONS });
    const [groupData] = useQuery<GetAllGroupData>({ query: GET_ALL_GROUP });
    const [shiftData] = useQuery<GetAllShiftData>({ query: GET_ALL_SHIFT });


    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        addList({ classInput: value }).then(({ data }) => {
            if (data?.addClass.success) {
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
                    {error?.message ?? data?.addClass.message}
                </Notification>
            }
            <p className="text-lg font-semibold">Add Class</p>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full p-5 border border-dashed border-textColor border-opacity-30 rounded-xl mt-5">
                <div className="grid grid-cols-5 gap-8">
                    <div className="col-span-2">
                        <Input
                            variant="standard"
                            label="Class Name"
                            color="green"
                            className="!text-base"
                            error={errors.name ? true : false}
                            success
                            {...register("name", { required: true })}
                        />
                    </div>
                    <div>
                        <h2 className={`text-base font-medium ml-3 mb-2 ${errors.shift && "text-red-600"}`}>Shift *</h2>
                        {shiftData.data?.getAllShifts.map((item, i) => (
                            <div key={i}>
                                <Checkbox
                                    id={item.id}
                                    label={item.name}
                                    color="green"
                                    className="rounded-sm w-4 h-4"
                                    value={item.id}
                                    {...register("shift", { required: true })}
                                    labelProps={{
                                        className: "text-base font-medium opacity-100"
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div>
                        <h2 className={`text-base font-medium ml-3 mb-2 ${errors.section && "text-red-600"}`}>Section*</h2>
                        {sectionData.data?.getAllSections.map((item, i) => (
                            <div key={i}>
                                <Checkbox
                                    id={item.id}
                                    label={item.name}
                                    color="green"
                                    className="rounded-sm w-4 h-4"
                                    value={item.id}
                                    {...register("section", { required: true })}
                                    labelProps={{
                                        className: "text-base font-medium opacity-100"
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div>
                        <h2 className="text-base font-medium ml-3 mb-2">Group</h2>
                        {groupData.data?.getAllGroups.map((item, i) => (
                            <div key={i}>
                                <Checkbox
                                    id={item.id}
                                    label={item.name}
                                    color="green"
                                    className="rounded-sm w-4 h-4"
                                    value={item.id}
                                    {...register("group")}
                                    labelProps={{
                                        className: "text-base font-medium opacity-100"
                                    }}
                                />
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
                        Save Class
                    </Button>
                </div>
            </form>
        </div >
    );
};

export default Add;