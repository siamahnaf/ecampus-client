import { ChangeEvent, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Input, Button } from "@material-tailwind/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import nextBase64 from "next-base64";

//Context
import { LoginContext } from "@/Context/login-context";

//Notifications
import { Notification } from "../Common/Notification";

//Urql
import { useMutation } from "urql";
import { USER_LOGIN } from "@/Urql/Query/Account/user.query";
import { UserLoginData } from "@/Urql/Types/Account/user.types";

//Types
interface Inputs {
    phone: string;
}

const Form = () => {
    //State
    const [notification, setNotification] = useState(false);

    //Urql
    const [{ fetching, error }, login] = useMutation<UserLoginData>(USER_LOGIN);

    //Initialize Hook
    const router = useRouter();

    //Context
    const { setVerify } = useContext(LoginContext);

    //Form
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm<Inputs>({
        defaultValues: {
            phone: "+880 " + nextBase64.decode(router.query.token as string || "")
        }
    })

    //Submit Handler
    const onSubmit: SubmitHandler<Inputs> = (value) => {
        login({ loginInput: { phone: value.phone.replace(/\+/g, '').replace(/\s+/g, '').replace(/(88)0+(?!1)(\d+)/g, '$1$2').replace(/^0+/, '') } }).then(({ data }) => {
            if (data?.login.success) {
                setVerify(true)
                router.push(`/login?verify=true&token=${nextBase64.encode(getValues("phone").substring(5))}`)
            }
            setNotification(true)
        })
    }

    //Handler -- notification
    const onNotification = () => {
        setNotification(false);
    };

    return (
        <div className="px-[10%] text-center">
            {error &&
                <Notification
                    open={notification}
                    handleClose={onNotification}
                    severity="error"
                >
                    {error?.message}
                </Notification>
            }
            <Image src="/images/logo.png" alt="logo" width={120} height={89} className="inline" />
            <h5 className="text-xl font-bold mt-[1.5em] mb-2.5">
                SIGNIN TO E-CAMPUS
            </h5>
            <p className="opacity-40 mb-[3em] text-sm">
                Please enter your phone number
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Phone Number"
                    size="lg"
                    className="rounded-lg"
                    color="green"
                    onInput={(e: ChangeEvent<HTMLInputElement>) => {
                        const formatted = e.target.value.trim()
                            .replace(/[^0-9+]/g, "")
                            .replace(/^(\+?88?)?0?/, "+880 ")
                            .replace(/(\d{6})(?=\d)/g, "$1 ");
                        e.target.value = formatted
                    }}
                    shrink={errors.phone ? false : true}
                    error={errors.phone ? true : false}
                    {...register("phone", {
                        required: true,
                        minLength: 11
                    })}
                />
                <Button className="bg-main text-white text-[15px] font-medium py-2.5 rounded-lg mt-5 relative" fullWidth color="green" defaultValue="John Doe" type="submit">
                    {fetching ? "PLEASE WAIT..." : "NEXT"}
                    {fetching &&
                        <div className="absolute top-2/4 right-4 -translate-y-2/4">
                            <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
                        </div>
                    }
                </Button>
            </form>
        </div>
    );
};

export default Form;