import { useEffect, useState } from "react";
import { Dialog, Input, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, useQuery } from "urql";
import { UPDATE_GRADE_SYSTEM, GET_GRADE_SYSTEM } from "@/Urql/Query/Examination/grade.query";
import { UpdateGradeData, GetGradesData, GradeData } from "@/Urql/Types/Examination/grade.types";

//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    defaultValue: GradeData;
    search: string;
}
//Interface
interface GradesField {
    name: string;
    percent_upto: string;
    percent_from: string;
    grade_point: string;
}
interface Inputs {
    name: string;
    grades: GradesField[];
}


const Edit = ({ open, onClose, defaultValue, search }: Props) => {
    //State
    const [notification, setNotification] = useState(false);

    //Urql
    const [{ data, error, fetching }, updateGrade] = useMutation<UpdateGradeData>(UPDATE_GRADE_SYSTEM);
    const [_, refetch] = useQuery<GetGradesData>({
        query: GET_GRADE_SYSTEM,
        variables: { searchInput: { search: search } },
        pause: true
    });

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
            grades: defaultValue.grades.map(item => ({ name: item.name, percent_upto: item.percent_upto, percent_from: item.percent_from, grade_point: item.grade_point }))
        }
    });

    //Use Field array
    const { fields, append, remove } = useFieldArray({
        control,
        name: "grades"
    });

    //On Submit Handler
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        updateGrade({ gradeInput: value, updateGradeId: defaultValue.id }).then(({ data }) => {
            if (data) {
                refetch({ requestPolicy: "network-only" })
                onClose()
            }
            setNotification(true)
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
            grades: defaultValue.grades.map(item => ({ name: item.name, percent_upto: item.percent_upto, percent_from: item.percent_from, grade_point: item.grade_point }))
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
                    {error?.message ?? data?.updateGrade.message}
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
                        Update Grade System
                    </DialogHeader>
                    <DialogBody className="py-6 overflow-auto max-h-[450px]">
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <h4 className="font-semibold mb-3 text-base">Grade Name</h4>
                                <Input
                                    label="Grade Name"
                                    color="green"
                                    error={errors.name ? true : false}
                                    {...register("name", { required: true })}
                                />
                            </div>
                            <div className="col-start-1 col-span-2">
                                <h4 className="font-semibold mb-3 text-base">Grades</h4>
                                {fields.map((_, i) => (
                                    <div key={i} className="my-3">
                                        <div key={i} className="grid grid-cols-4 gap-5">
                                            <div>
                                                <Input
                                                    label="Grade Name"
                                                    color="green"
                                                    readOnly
                                                    error={(errors.grades && errors.grades[i]?.name) ? true : false}
                                                    {...register(`grades.${i}.name`, { required: true })}
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    label="Percent From"
                                                    color="green"
                                                    error={(errors.grades && errors.grades[i]?.percent_from) ? true : false}
                                                    readOnly
                                                    {...register(`grades.${i}.percent_from`, { required: true })}
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    label="Percent Upto"
                                                    color="green"
                                                    error={(errors.grades && errors.grades[i]?.percent_upto) ? true : false}
                                                    readOnly
                                                    {...register(`grades.${i}.percent_upto`, { required: true })}
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    label="Grade Point"
                                                    color="green"
                                                    error={(errors.grades && errors.grades[i]?.grade_point) ? true : false}
                                                    readOnly
                                                    {...register(`grades.${i}.grade_point`, { required: true })}
                                                />
                                            </div>

                                        </div>
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
                        <Button variant="outlined" color="green" size="sm" onClick={onClose} type="button">Cancel</Button>
                        <Button color="green" size="sm" className="bg-main px-6" type="submit" disabled={fetching}>Save Grade System</Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </div>
    );
};

export default Edit;