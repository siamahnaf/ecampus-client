import { Icon } from "@iconify/react";

//Components
import Select from "./Header/Select";
import Profile from "./Header/Profile";
import Notification from "./Header/Notification";

const Header = () => {
    return (
        <div className="grid grid-cols-12 gap-3 mt-3 items-center">
            <div className="col-span-7">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input w-full rounded-3xl input-sm bg-textColor bg-opacity-5 focus:outline-none pl-14 py-[18px]"
                    />
                    <Icon icon="material-symbols:search" className="text-xl absolute top-2/4 left-6 -translate-y-2/4" />
                </div>
            </div>
            <div className="col-span-5">
                <div className="flex gap-8 items-center justify-end">
                    <div className="w-36">
                        <Select />
                    </div>
                    <Notification />
                    <div>
                        <Profile />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;