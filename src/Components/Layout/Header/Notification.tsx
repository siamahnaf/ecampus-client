import { useState, useRef, useEffect, Fragment } from "react";
import { Icon } from "@iconify/react";
import { Typography } from "@material-tailwind/react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { pushNotification, NotificationPrompt } from "reactjs-push-notification";
import Link from "next/link";

//Custom Hook
import { useOutsideClick } from "@/Utilis/hook";

//Days extend
dayjs.extend(relativeTime);

//Urql
import { useSubscription, useQuery, useMutation } from "urql";
import { NOTIFY_EVENT, GET_NOTIFICATIONS, MARK_AS_READ } from "@/Urql/Query/Communication/notification.query";
import { NotifyData, GetNotificationData, NotificationData, MarkAsReadData } from "@/Urql/Types/Communication/notification.types";


const handleSubscription = (messages: NotificationData[] = [], response: NotifyData): NotificationData[] => {
    return [response.notifyEvent, ...messages];
};

const Notification = () => {
    //State
    const [open, setOpen] = useState<boolean>(false);

    //Urql
    const [res] = useSubscription<NotifyData, NotificationData[]>({ query: NOTIFY_EVENT }, handleSubscription);
    const [{ data }, refetch] = useQuery<GetNotificationData>({ query: GET_NOTIFICATIONS });
    const [_, markAsRead] = useMutation<MarkAsReadData>(MARK_AS_READ)

    //Combining Data
    const mergedEvents = [...(res.data || []), ...(data?.getNotifications || [])];

    //Initializing Hook
    const ref = useRef(null);

    //Use Click outside
    useOutsideClick(ref, () => {
        setOpen(false)
    });

    const onReadHandler = (id: string) => {
        markAsRead({ markAsReadNotificationId: id }).then(() => {
            refetch({ requestPolicy: "network-only" });
        });
    }

    //Lifecycle hook
    useEffect(() => {
        if (res.data) {
            pushNotification({
                title: res.data[0].title,
                subtitle: "",
                message: res.data[0].details
            });
        }
    }, [res]);

    return (
        <div className="indicator relative" ref={ref}>
            <div className="cursor-pointer select-none" onClick={() => setOpen(!open)}>
                {mergedEvents.filter(item => item.read === false).length > 0 && (
                    <span className="indicator-item badge badge-secondary w-3 h-3 rounded-full p-0 indicator-end top-[3px] right-[3px] bg-red-600 border-red-600"></span>
                )}
                <div className="bg-textColor bg-opacity-5 p-[9px] rounded-full">
                    <Icon icon="mingcute:notification-fill" className="text-xl" />
                </div>
            </div>
            <div className={`absolute bg-white top-full right-0 transition-all duration-300 ease-in-out  ${open ? "opacity-1 visible translate-y-0" : "opacity-0 invisible -translate-y-1 "} w-[500px] rounded-md shadow-lg z-50`}>
                <div className="flex gap-2 items-center py-5 px-4">
                    <Typography variant="h5" className="flex-1">
                        Notifications ({mergedEvents.filter(item => item.read === false).length})
                    </Typography>
                </div>
                <hr />
                <div className="max-h-[450px] overflow-auto">
                    <NotificationPrompt>
                        <div className="flex gap-5 items-center px-4 py-5 cursor-pointer">
                            <div className="indicator">
                                <span className="indicator-item badge badge-secondary p-0 w-3 h-3 rounded-full border-white bg-red-600 top-[4px] right-[5px] border-2"></span>
                                <div>
                                    <Icon className="text-2xl text-main" icon="mingcute:notification-fill" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <Typography variant="h5" className="text-main text-lg font-bold">
                                    Push Notification
                                </Typography>
                                <Typography variant="paragraph" className="text-[15px] opacity-70">
                                    Please allow your notification to never miss any update!
                                </Typography>
                            </div>
                            <div>
                                <Icon className="text-main text-3xl -rotate-90" icon="material-symbols:keyboard-arrow-down-rounded" />
                            </div>
                        </div>
                    </NotificationPrompt>
                    <hr />
                    <ul>
                        {mergedEvents.map((item, i) => (
                            <Fragment key={i} >
                                <li>
                                    {item.path?.type ? (
                                        <Link href={item.path.type === "complain" ? "/complain" : item.path.type === "notice" ? "/teacher-notice" : "/"} className="flex gap-3" onClick={() => onReadHandler(item.id)}>
                                            <div className={`w-12 h-auto ${!item.read ? "bg-primary" : "bg-none"}`}></div>
                                            <div className="py-4 pr-4">
                                                <div className="flex gap-2 items-center">
                                                    <div className="flex-1">
                                                        <Typography variant="h6" className="line-clamp-1">{item.title}</Typography>
                                                        <Typography variant="paragraph" className="line-clamp-2">{item.details}</Typography>
                                                    </div>
                                                    <div className="capitalize basis-[25%] text-sm opacity-40 text-right">
                                                        {dayjs(item.created_at).fromNow()}
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    {item.image &&
                                                        <Image src={process.env.NEXT_PUBLIC_IMAGE_URL + item.image} alt={item.title} width={800} height={300} className="rounded-lg" />
                                                    }
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="flex gap-3" onClick={() => onReadHandler(item.id)}>
                                            <div className={`w-12 h-auto ${!item.read ? "bg-primary" : "bg-none"}`}></div>
                                            <div className="py-4 pr-4">
                                                <div className="flex gap-2 items-center">
                                                    <div className="flex-1">
                                                        <Typography variant="h6" className="line-clamp-1">{item.title}</Typography>
                                                        <Typography variant="paragraph" className="line-clamp-2">{item.details}</Typography>
                                                    </div>
                                                    <div className="capitalize basis-[25%] text-sm opacity-40 text-right">
                                                        {dayjs(item.created_at).fromNow()}
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    {item.image &&
                                                        <Image src={process.env.NEXT_PUBLIC_IMAGE_URL + item.image} alt={item.title} width={800} height={300} className="rounded-lg" />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </li>
                                <hr />
                            </Fragment>
                        ))}
                    </ul>
                </div>
                <div className="py-3 px-4 text-center">
                    <button className="text-sm font-bold text-main">Mark As Read</button>
                </div>
            </div>
        </div>
    );
};

export default Notification;