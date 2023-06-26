import { Breadcrumbs } from "@material-tailwind/react";

//interface
interface Props {
    title: string;
    navs: string[];
}

const PageHeader = ({ title, navs }: Props) => {
    return (
        <div className="flex gap-3 my-3 items-center">
            <p className="flex-1 text-main font-bold text-xl uppercase">{title}</p>
            <Breadcrumbs className="bg-transparent breadcrumbs">
                {navs.map((item, i) => (
                    <p className="opacity-50" key={i}>
                        {item}
                    </p>
                ))}
            </Breadcrumbs>
        </div>
    );
};

export default PageHeader;