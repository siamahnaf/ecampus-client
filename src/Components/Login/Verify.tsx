import { useContext, ChangeEvent, useState } from "react";
import { Input } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import nextBase64 from "next-base64";
import { Icon } from "@iconify/react";

//Components
import Timer from "./Verify/Timer";

//Context
import { LoginContext } from "@/Context/login-context";

//Notifications
import { Notification } from "../Common/Notification";

//Urql
import { useMutation } from "urql";
import { VERIFY_PHONE } from "@/Urql/Query/Account/user.query";
import { VerifyPhoneData } from "@/Urql/Types/Account/user.types";

const Verify = () => {
    //Initialize Hook
    const router = useRouter();

    //State
    const [notification, setNotification] = useState(false);

    //Urql
    const [{ error, fetching }, verify] = useMutation<VerifyPhoneData>(VERIFY_PHONE);

    //Context
    const { setVerify } = useContext(LoginContext);

    //On Change Handler
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length === 6) {
            const data = {
                phone: "880" + (nextBase64.decode(router.query.token as string).replace(/\s+/g, '').replace(/(88)0+(?!1)(\d+)/g, '$1$2').replace(/^0+/, '')),
                otp: e.target.value
            }
            verify({ verifyInput: data }).then(({ data }) => {
                if (data?.verify.success) {
                    router.push("/")
                }
                setNotification(true)
            })
        }
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
            <div className="flex gap-1 justify-center mb-2 mt-[1.4em]">
                <h5 className="text-2xl font-medium mb-1.5">
                    {router.query.token &&
                        "+880" + nextBase64.decode(router.query.token as string).replace(/^0+/, '')
                    }
                </h5>
                <div className="ml-1.5 w-max">
                    <div className="tooltip tooltip-bottom" data-tip="Wrong Phone?">
                        <Link href={`/login?token=${router.query.token}`} onClick={() => setVerify(false)} className="opacity-30">
                            <Icon icon="material-symbols:edit" className="text-2xl -mb-0.5" />
                        </Link>
                    </div>
                </div>
            </div>
            <p className="text-[17px] opacity-80 mb-9 px-[5%]">We&apos;ve sent the code to your phone. Please check your message.</p>
            <div className="relative mb-3">
                <Input
                    label="Verification code"
                    autoComplete="off"
                    color="green"
                    size="lg"
                    onInput={(e: ChangeEvent<HTMLInputElement>) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '')
                        if (e.target.value.length > 6) {
                            e.target.value = e.target.value.substring(0, 6)
                        }
                    }}
                    onChange={onChange}
                />
                {fetching &&
                    <div className="absolute top-2/4 right-4 -translate-y-2/4">
                        <div className="w-5 h-5 border-b-2 border-main rounded-full animate-spin"></div>
                    </div>
                }
            </div>
            <Timer />
        </div>
    );
};

export default Verify;