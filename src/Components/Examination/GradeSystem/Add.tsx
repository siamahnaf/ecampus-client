import { useState } from "react";
import { Input, Button } from "@material-tailwind/react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

//Components
import { Notification } from "@/Components/Common/Notification";

//Urql
import { useMutation, useQuery } from "urql";
import { ADD_GRADE_SYSTEM, GET_GRADE_SYSTEM } from "@/Urql/Query/Examination/grade.query";
import { AddGradeData, GetGradesData } from "@/Urql/Types/Examination/grade.types";

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

const Add = () => {
    //State
    const [notification, setNotification] = useState(false);

    //Urql
    const [{ data, error, fetching }, addGrade] = useMutation<AddGradeData>(ADD_GRADE_SYSTEM);
    const [_, refetch] = useQuery<GetGradesData>({
        query: GET_GRADE_SYSTEM,
        variables: { searchInput: { search: "" } },
        pause: true
    });

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //Form Initializing
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        control
    } = useForm<Inputs>({
        defaultValues: {
            grades: [{ name: "", percent_from: "", percent_upto: "", grade_point: "" }]
        }
    });

    //Use Field array
    const { fields, append, remove } = useFieldArray({
        control,
        name: "grades"
    });

    //Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        addGrade({ gradeInput: value }).then(({ data }) => {
            if (data) {
                refetch({ requestPolicy: "network-only" });
                reset()
            }
            setNotification(true)
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
                    {error?.message ?? data?.addGrade.message}
                </Notification>
            }
            <p className="text-lg font-semibold">Add Grade System</p>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full p-5 border border-dashed border-textColor border-opacity-30 rounded-xl mt-5">
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
                        <button onClick={() => append({ name: "", percent_upto: "", percent_from: "", grade_point: "" })} className="text-sm text-main font-medium mt-4" type="button">
                            <span className="mr-1">+</span> Add More
                        </button>
                        {fields.map((_, i) => (
                            <div key={i} className="my-3">
                                <div key={i} className="grid grid-cols-4 gap-5">
                                    <div>
                                        <Input
                                            label="Grade Name"
                                            color="green"
                                            error={(errors.grades && errors.grades[i]?.name) ? true : false}
                                            {...register(`grades.${i}.name`, { required: true })}
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            label="Percent From"
                                            color="green"
                                            error={(errors.grades && errors.grades[i]?.percent_from) ? true : false}
                                            {...register(`grades.${i}.percent_from`, { required: true })}
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            label="Percent Upto"
                                            color="green"
                                            error={(errors.grades && errors.grades[i]?.percent_upto) ? true : false}
                                            {...register(`grades.${i}.percent_upto`, { required: true })}
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            label="Grade Point"
                                            color="green"
                                            error={(errors.grades && errors.grades[i]?.grade_point) ? true : false}
                                            {...register(`grades.${i}.grade_point`, { required: true })}
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
                        Save Grade System
                    </Button>
                </div>
            </form>
        </div >
    );
};

export default Add;