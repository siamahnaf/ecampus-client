import { ChangeEvent, useContext } from "react";
import { Checkbox } from "@material-tailwind/react";

//Context
import { NotificationContext } from "@/Context/notification-context";

//Urql
import { useQuery } from "urql";
import { GET_ALL_CLASS } from "@/Urql/Query/Academics/class.query";
import { GetAllClassData } from "@/Urql/Types/Academics/class.types";

const Classes = () => {
    //Context
    const { setValue, getValues, watch } = useContext(NotificationContext);

    //Urql
    const [classData] = useQuery<GetAllClassData>({ query: GET_ALL_CLASS, variables: { searchInput: { search: "" } } });

    //Form Data
    const formData = watch?.();

    //Handler
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target;
        const oldData = getValues?.("receivers");
        if (checked) {
            setValue?.("receivers", [...oldData || [], { id: value, name: "", role: "", type: "class" }]);
        } else {
            const newValue = oldData?.filter(item => item.id !== value);
            setValue?.("receivers", newValue || []);
        }
    }

    return (
        <div>
            <div>
                {classData.data?.getAllClass.map((item, i) => (
                    <div key={i}>
                        <Checkbox
                            label={item.name}
                            id={item.id}
                            value={item.id}
                            color="green"
                            className="w-4 h-4 rounded-sm"
                            labelProps={{ className: "font-medium text-[15px] text-textColor" }}
                            onChange={onChange}
                            readOnly
                            checked={formData?.receivers.some(a => a.id === item.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Classes;