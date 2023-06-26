import { useState, useContext } from "react";
import { inter } from "@/Fonts";
import { Dialog, DialogBody, Input, Typography, Button } from "@material-tailwind/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

//Context
import { SiteContext } from "@/Context/site-context";

//Icons List
const socialMediaIcons = [
    "fa6-brands:facebook",
    "fa6-brands:facebook-f",
    "fa6-brands:facebook-messenger",
    "fa6-brands:square-facebook",
    "fa6-brands:square-twitter",
    "fa6-brands:twitter",
    "fa6-brands:instagram",
    "fa6-brands:square-instagram",
    "fa6-brands:linkedin",
    "fa6-brands:linkedin-in",
    "fa6-brands:pinterest",
    "fa6-brands:pinterest",
    "fa6-brands:square-pinterest",
    "fa6-brands:snapchat",
    "fa6-brands:square-snapchat",
    "fa6-brands:square-youtube",
    "fa6-brands:youtube",
    "fa6-brands:square-vimeo",
    "fa6-brands:vimeo",
    "fa6-brands:vimeo-v",
    "fa6-brands:square-tumblr",
    "fa6-brands:tumblr",
    "fa6-brands:flickr",
    "fa6-brands:reddit",
    "fa6-brands:reddit-alien",
    "fa6-brands:square-reddit",
    "fa6-brands:square-whatsapp",
    "fa6-brands:whatsapp",
    "fa6-brands:telegram",
    "fa6-brands:slack",
    "fa6-brands:discord",
    "fa6-brands:github",
    "fa6-brands:github-alt",
    "fa6-brands:square-github",
    "fa6-brands:gitlab",
    "fa6-brands:square-gitlab",
    "fa6-brands:bitbucket",
    "fa6-brands:medium",
    "fa6-brands:wordpress",
    "fa6-brands:wordpress-simple",
    "fa6-brands:blogger",
    "fa6-brands:blogger-b",
    "fa6-brands:tiktok",
    "fa6-brands:spotify",
    "fa6-brands:soundcloud"
]

//Interface
interface Props {
    open: boolean,
    onClose: () => void;
    i: number;
}

const Icons = ({ open, onClose, i }: Props) => {
    //State
    const [name, setNames] = useState<string>("");

    //Context
    const { setValue, watch } = useContext(SiteContext);

    //Handler
    const onIconSelect = (value: string) => {
        setValue?.(`socials.${i}.icon`, value);
        onClose();
    }

    const onCustomHandler = () => {
        setValue?.(`socials.${i}.icon`, name);
        onClose();
    }

    return (
        <Dialog
            open={open}
            handler={onClose}
            animate={{
                mount: { y: 0 },
                unmount: { y: -15 },
            }}
            size="lg"
            style={{ fontFamily: inter.style.fontFamily }}
            className="rounded-lg"
        >
            <DialogBody className="text-textColor">
                <div className="text-right mb-3">
                    <button className="bg-red-600 bg-opacity-20 p-1.5 rounded" onClick={onClose}>
                        <Icon className="text-xl text-red-600" icon="iconamoon:close-duotone" />
                    </button>
                </div>
                <div className="flex gap-5 flex-wrap mt-2">
                    {socialMediaIcons.map((item, index) => (
                        <button className={`transition-all w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 ${watch?.().socials[i]?.icon === item ? "bg-main text-white" : ""}`} onClick={() => onIconSelect(item)} key={index}>
                            <Icon className="text-lg fill-text-mai" icon={item} />
                        </button>
                    ))}
                </div>
                <Typography variant="h6" className="mt-6 mb-2">
                    Add Custom Icon
                </Typography>
                <div className="grid grid-cols-5 gap-3 items-center">
                    <div className="col-span-2">
                        <Input
                            label="Icon Name"
                            color="green"
                            onChange={(e) => setNames(e.target.value)}
                        />
                    </div>
                    <div className="col-span-2">
                        <p className="text-base"><span className="opacity-60">You need to use icon from</span> <Link href="https://iconify.design/" target="_blank" className="font-bold">Iconify</Link></p>
                        <p className="text-sm font-bold">Example: ic:baseline-plus-minus-alt</p>
                    </div>
                    <div className="text-right">
                        <Button color="green" className={`py-2.5 px-8  ${!name ? "bg-gray-500" : "bg-main"}`} disabled={name === ""} onClick={onCustomHandler}>
                            Save
                        </Button>
                    </div>
                </div>
            </DialogBody>
        </Dialog>
    );
};

export default Icons;