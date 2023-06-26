import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Typography } from "@material-tailwind/react";

//Component
import { Notification } from "@/Components/Common/Notification";
import General from "./General";
import Seo from "./Seo";
import Additional from "./Additional";
import Socials from "./Socials";

//Context
import { SiteContext, Inputs } from "@/Context/site-context";

//Urql
import { useMutation, useQuery } from "urql";
import { ADD_SETTINGS, GET_SETTINGS } from "@/Urql/Query/Settings/settings.query";
import { AddSettingData, GetSettingsData } from "@/Urql/Types/Settings/setting.types";

interface AnyObject {
    [key: string]: any;
}

const Sites = () => {
    //State
    const [notification, setNotification] = useState(false);

    //Urql
    const [addData, addSettings] = useMutation<AddSettingData>(ADD_SETTINGS);
    const [{ data }, refetch] = useQuery<GetSettingsData>({ query: GET_SETTINGS });

    //Removing __typename property
    function removeTypename(obj: AnyObject) {
        if (typeof obj === "object" && obj !== null) {
            if (Array.isArray(obj)) {
                obj = obj.map((item) => removeTypename(item));
            } else {
                Object.keys(obj).forEach((key) => {
                    if (key === "__typename") {
                        delete obj[key];
                    } else {
                        obj[key] = removeTypename(obj[key]);
                    }
                });
            }
        }
        return obj as GetSettingsData;
    }

    const result: GetSettingsData = removeTypename(data as GetSettingsData);

    //Form Initialize
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        getValues,
        watch
    } = useForm<Inputs>({
        defaultValues: result?.getSettings
    });

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    //On Submit
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        addSettings({ settingInput: value }).then(() => {
            setNotification(true);
            refetch({ requestPolicy: "network-only" })
        })
    };

    return (
        <SiteContext.Provider value={{ register, setValue, errors, control, getValues, watch }}>
            <form onSubmit={handleSubmit(onSubmit)} className="my-6">
                {(addData.error || addData.data) &&
                    <Notification
                        open={notification}
                        handleClose={onNotification}
                        severity={addData.error?.message ? "error" : "success"}
                    >
                        {addData.error?.message ?? addData.data?.addSettings.message}
                    </Notification>
                }
                <Typography variant="h5" className="uppercase text-lg font-medium mb-2">
                    Site Setting
                </Typography>
                <General />
                <Seo />
                <Additional />
                <Socials />
                <div className="col-start-1 flex gap-2 items-center">
                    <Button color="green" className="bg-main py-2.5 px-6" type="submit">
                        Save Profile
                    </Button>
                    <div>
                        {addData.fetching &&
                            <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin ml-auto"></div>
                        }
                    </div>
                </div>
            </form>
        </SiteContext.Provider>
    );
};

export default Sites;