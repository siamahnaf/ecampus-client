import { useContext, ChangeEvent } from "react";
import { Checkbox } from "@material-tailwind/react";

//Context
import { NotificationContext } from "@/Context/notification-context";

const GroupData = [
    { value: "student", label: "Student" },
    { value: "parents", label: "Parents" },
    { value: "teacher", label: "Teacher" },
    { value: "accountant", label: "Accountant" }
]

const Group = () => {
    //Context
    const { setValue, getValues, watch } = useContext(NotificationContext);

    //Form Data
    const formData = watch?.();

    //Handler
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target;
        const oldData = getValues?.("receivers");
        if (checked) {
            setValue?.("receivers", [...oldData || [], { id: value, name: "", role: "", type: "role" }]);
        } else {
            const newValue = oldData?.filter(item => item.id !== value);
            setValue?.("receivers", newValue || []);
        }
    }

    return (
        <div>
            {GroupData.map((item, i) => (
                <div key={i}>
                    <Checkbox
                        label={item.label}
                        id={item.value + i}
                        value={item.value}
                        color="green"
                        className="w-4 h-4 rounded-sm"
                        labelProps={{ className: "font-medium text-[15px] text-textColor" }}
                        onChange={onChange}
                        readOnly
                        checked={formData?.receivers.some(a => a.id === item.value)}
                    />
                </div>
            ))}
        </div>
    );
};

export default Group;