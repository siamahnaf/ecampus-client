import { useEffect, useState, useContext } from "react";
import { Dialog, Input, DialogHeader, DialogBody, DialogFooter, Button, Checkbox } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import { useForm, SubmitHandler } from "react-hook-form";

//Components
import { Notification } from "@/Components/Common/Notification";

//Context
import { PaginationContext } from "@/Context/pagination.context";

//Urql
import { useMutation, useQuery } from "urql";
import { UPDATE_CLASS, GET_CLASS_LIST, GET_ALL_CLASS } from "@/Urql/Query/Academics/class.query";
import { UpdateClassData, GetClassListData, GetAllClassData, ClassData } from "@/Urql/Types/Academics/class.types";
import { GET_ALL_SECTIONS } from "@/Urql/Query/Academics/section.query";
import { GetAllSectionData } from "@/Urql/Types/Academics/section.types";
import { GET_ALL_SHIFT } from "@/Urql/Query/Academics/shift.query";
import { GetAllShiftData } from "@/Urql/Types/Academics/shift.types";
import { GET_ALL_GROUP } from "@/Urql/Query/Academics/group.query";
import { GetAllGroupData } from "@/Urql/Types/Academics/group.types";

//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    defaultValue: ClassData
}
interface Inputs {
    name: string;
    section: string[];
    group: string[];
    shift: string[];
}

const Edit = ({ open, onClose, defaultValue }: Props) => {
    //State
    const [notification, setNotification] = useState(false);

    //Context
    const { variables } = useContext(PaginationContext);

    //Urql
    const [{ data, error, fetching }, updateList] = useMutation<UpdateClassData>(UPDATE_CLASS);
    const [_, refetch] = useQuery<GetClassListData>({
        query: GET_CLASS_LIST,
        variables: { searchInput: variables },
        pause: true
    });
    const [__, refetchAll] = useQuery<GetAllClassData>({ query: GET_ALL_CLASS, pause: true });
    const [sectionData] = useQuery<GetAllSectionData>({ query: GET_ALL_SECTIONS });
    const [groupData] = useQuery<GetAllGroupData>({ query: GET_ALL_GROUP });
    const [shiftData] = useQuery<GetAllShiftData>({ query: GET_ALL_SHIFT });

    //UseForm
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm<Inputs>({
        defaultValues: {
            name: defaultValue.name,
            section: defaultValue.section.map((item) => item.id),
            group: defaultValue.group.map((item) => item.id),
            shift: defaultValue.shift.map((item) => item.id)
        }
    });

    //On Submit Handler
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        updateList({ classInput: value, updateClassId: defaultValue.id }).then(({ data }) => {
            setNotification(true);
            refetch({ requestPolicy: "network-only" })
            refetchAll({ requestPolicy: "network-only" })
            if (data?.updateClass.success) {
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
            section: defaultValue.section.map((item) => item.id),
            group: defaultValue.group.map((item) => item.id),
            shift: defaultValue.shift.map((item) => item.id)
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
                    {error?.message ?? data?.updateClass.message}
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
                    <DialogBody className="py-6 aspect-[104/45] max-h-full overflow-auto">
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
                                <h2 className={`text-base font-medium ml-3 mb-2 ${errors.shift && "text-red-600"}`}>Shift</h2>
                                {shiftData.data?.getAllShifts.map((item, i) => (
                                    <div key={i}>
                                        <Checkbox
                                            id={item.id + "shiftUpdated"}
                                            label={item.name}
                                            color="green"
                                            className="rounded-sm w-4 h-4"
                                            value={item.id}
                                            {...register("shift")}
                                            labelProps={{
                                                className: "text-base font-medium opacity-100"
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h2 className="text-base font-medium ml-3 mb-2">Section</h2>
                                {sectionData.data?.getAllSections.map((item, i) => (
                                    <div key={i}>
                                        <Checkbox
                                            id={item.id + "sectionUpdated"}
                                            label={item.name}
                                            color="green"
                                            className="rounded-sm w-4 h-4"
                                            value={item.id}
                                            {...register("section")}
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
                                            id={item.id + "groupUpdated"}
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
                    </DialogBody>
                    <DialogFooter className="flex gap-3">
                        <div className="flex-1">
                            {fetching &&
                                <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                            }
                        </div>
                        <Button variant="outlined" color="green" size="sm" onClick={onClose} className="focus:right-0">Cancel</Button>
                        <Button color="green" size="sm" className="bg-main px-6" type="submit" disabled={fetching}>
                            Save Class
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </div>
    );
};

export default Edit;