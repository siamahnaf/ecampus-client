import { useContext, useState } from "react";
import { Typography, Input } from "@material-tailwind/react";
import { useFieldArray } from "react-hook-form";

//Components
import Icons from "./Icons";

//Context
import { SiteContext } from "@/Context/site-context";

const Socials = () => {
    //State
    const [open, setOpen] = useState<number | null>(null);

    //Context
    const { register, control } = useContext(SiteContext);

    //use field array
    const { fields, append, remove } = useFieldArray({
        control,
        name: "socials"
    });

    //On Handler
    const onClose = () => {
        setOpen(null);
    }

    return (
        <div>
            <Typography variant="h6" className="font-medium mb-3">
                Social Media URLs
            </Typography>
            <div>
                <button
                    type="button"
                    onClick={() => append({ icon: "", url: "" })}
                    className="text-sm text-main font-medium"
                >
                    <span className="mr-1">+</span> Add More
                </button>
                {fields.map((field, i) => (
                    <div className="my-4" key={i}>
                        <div key={i} className="grid grid-cols-3 gap-4">
                            <div>
                                <Input
                                    label="Select Icon"
                                    color="green"
                                    {...register?.(`socials.${i}.icon`)}
                                    className="cursor-pointer"
                                    onClick={() => setOpen(i)}
                                    readOnly
                                />
                                <Icons
                                    open={i === open}
                                    onClose={onClose}
                                    i={i}
                                />
                            </div>
                            <div className="col-span-2">
                                <Input
                                    label="URL"
                                    color="green"
                                    {...register?.(`socials.${i}.url`)}
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

export default Socials;