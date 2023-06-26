import { ReactNode } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";

//Components
import Logo from "@/Components/Layout/Logo";
import Navs from "@/Components/Layout/Navs";
import Header from "@/Components/Layout/Header";

//Seo
import Seo from "@/Utilis/Seo";

//Interface
interface Props {
    main?: string;
    sub?: string;
    title?: string;
    children: ReactNode
}

const Layout = ({ main, sub, title, children }: Props) => {
    return (
        <div className="grid grid-cols-9 gap-2">
            <Seo title={title} />
            <div className="col-span-2 shadow-3xl">
                <OverlayScrollbarsComponent
                    defer
                    options={{
                        scrollbars: {
                            autoHide: "move"
                        }
                    }}
                    element="div"
                    style={{ height: "100vh" }}
                >
                    <div>
                        <Logo />
                        <Navs main={main} sub={sub} />
                    </div>
                </OverlayScrollbarsComponent>
            </div>
            <div className="col-span-7 px-3 overflow-auto h-screen">
                <Header />
                {children}
            </div>
        </div>
    );
};
export default Layout;