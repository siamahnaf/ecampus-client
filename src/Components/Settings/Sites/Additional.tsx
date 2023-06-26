import { useContext } from "react";
import { Typography, Input } from "@material-tailwind/react";
import { useFieldArray } from "react-hook-form";

//Context
import { SiteContext } from "@/Context/site-context";

const Additional = () => {
    //Context
    const { register, setValue, control } = useContext(SiteContext);

    //use field array
    const { fields, append, remove } = useFieldArray({
        control,
        name: "moreInfo"
    });

    return (
        <div className="my-5">
            <Typography variant="h6" className="font-medium mb-3">
                General Information
            </Typography>
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <Input
                        label="Email"
                        color="green"
                        type="email"
                        {...register?.("email")}
                    />
                </div>
                <div>
                    <Input
                        label="Phone"
                        color="green"
                        {...register?.("phone")}
                    />
                </div>
                <div>
                    <Input
                        label="Office Address"
                        color="green"
                        {...register?.("office")}
                    />
                </div>
                <div>
                    <Input
                        label="Head Office Address"
                        color="green"
                        {...register?.("headOffice")}
                    />
                </div>
            </div>
            <div className="mt-4">
                <button
                    type="button"
                    onClick={() => append({ title: "", value: "" })}
                    className="text-sm text-main font-medium"
                >
                    <span className="mr-1">+</span> Add More
                </button>
                {fields.map((field, i) => (
                    <div className="my-4" key={i}>
                        <div key={i} className="grid grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label="Title"
                                    color="green"
                                    {...register?.(`moreInfo.${i}.title`)}
                                />
                            </div>
                            <div>
                                <Input
                                    label="Value"
                                    color="green"
                                    {...register?.(`moreInfo.${i}.value`)}
                                />
                            </div>
                        </div>
                        <div className="text-right">
                            <button className="text-xs text-red-600" onClick={() => remove(i)} disabled={fields.length <= 1}>
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Additional;