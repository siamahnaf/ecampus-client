import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";

//Custom Hook
import { useOutsideClick } from "@/Utilis/hook";

//Urql
import { useQuery, useMutation } from "urql";
import { GET_PROFILE, LOGOUT } from "@/Urql/Query/Account/profile.query";
import { GetProfileData, LogoutData } from "@/Urql/Types/Account/profile.types";

const Profile = () => {
    //Initialize Hook
    const router = useRouter();

    //State
    const [open, setOpen] = useState<boolean>(false);

    //Graphql
    const [{ data }] = useQuery<GetProfileData>({ query: GET_PROFILE });
    const [_, logout] = useMutation<LogoutData>(LOGOUT)

    //Initializing Hook
    const ref = useRef(null);

    //Use Click outside
    useOutsideClick(ref, () => {
        setOpen(false)
    });

    //Handler On Logout
    const onLogout = () => {
        logout().then(({ data }) => {
            if (data?.logout.success) {
                router.reload()
            }
        });
    }

    return (
        <div className="relative" ref={ref}>
            {data?.getProfile?.image ? (
                <Image
                    src={process.env.NEXT_PUBLIC_IMAGE_URL + data?.getProfile.image}
                    alt="Profile"
                    width={60} height={60}
                    className="w-12 h-12 object-fill rounded-full cursor-pointer"
                    onClick={() => setOpen(!open)}
                />
            ) : (
                <Image
                    src="/images/profile.jpg"
                    alt="Profile"
                    width={60} height={60}
                    className="w-12 h-12 rounded-full cursor-pointer"
                    onClick={() => setOpen(!open)}
                />
            )}
            <div className={`absolute right-0 w-72 top-full mt-1 transition-all duration-300 ease-in-out ${open ? "opacity-1 visible translate-y-0" : "opacity-0 invisible -translate-y-1 "} bg-white shadow-lg rounded-lg z-50`}>
                <div className="px-5 pt-5">
                    <Link href="/" className="flex gap-3 items-center">
                        {data?.getProfile?.image ? (
                            <Image
                                src={process.env.NEXT_PUBLIC_IMAGE_URL + data?.getProfile.image} alt="Profile"
                                width={100} height={100}
                                className="w-16 h-16 rounded-full cursor-pointer"
                            />
                        ) : (
                            <Image
                                src="/images/profile.jpg" alt="Profile"
                                width={100} height={100}
                                className="w-16 h-16 rounded-full cursor-pointer"
                            />
                        )}
                        <div>
                            <p className="text-xl font-medium">{data?.getProfile?.name}</p>
                            <p className="text-base">+{data?.getProfile?.phone}</p>
                        </div>
                    </Link>
                </div>
                <div className="divider after:h-px before:h-px"></div>
                <div className="px-6 pb-5">
                    <div className="flex gap-2 items-center mb-3 cursor-pointer select-none">
                        <Icon icon="material-symbols:help" className="inline text-[21px]" />
                        <p className="text-base">Help</p>
                    </div>
                    <div className="flex gap-2 items-center text-red-600 cursor-pointer select-none" onClick={onLogout}>
                        <Icon icon="lucide:log-out" className="inline text-[20px]" />
                        <p className="text-base">Logout</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;