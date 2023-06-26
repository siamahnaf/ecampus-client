import { Icon } from "@iconify/react";

//Urql
import { Meta } from "@/Urql/Types/success.types";

//Interface
interface Props {
    onNextClick: () => void;
    onPrevClick: () => void;
    meta: Meta | undefined;
    onSetPage: (page: number) => void;
}

const Pagination = ({ onNextClick, onPrevClick, meta, onSetPage }: Props) => {
    //On Next
    const onNext = () => {
        onNextClick();
    }

    //On Prev
    const onPrev = () => {
        onPrevClick();
    }

    //Get page number
    const getPageNumbers = () => {
        const totalPages = meta?.totalPages as number;
        const currentPage = meta?.currentPage as number;
        const pageNumbers = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            let startPage;
            let endPage;

            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }

            if (startPage > 1) {
                pageNumbers.push("...");
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages) {
                pageNumbers.push("...");
            }
        }
        return pageNumbers;
    };


    return (
        <div className="flex gap-2 items-center w-max ml-auto px-5 mt-8 rounded text-main">
            <button className={`w-8 h-8 rounded flex justify-center items-center ${meta?.currentPage as number <= 1 && "opacity-50 pointer-events-none"}`} onClick={onPrev}>
                <Icon className="text-2xl" icon="mingcute:left-line" />
            </button>
            {getPageNumbers().map((pageNumber, i) => {
                if (pageNumber !== "...") {
                    return (
                        <button key={i} className={`w-8 h-8 rounded flex justify-center items-center text-[15px] ${meta?.currentPage === pageNumber ? "bg-main text-white" : "bg-primary text-main"}`} onClick={() => onSetPage(pageNumber as number)}>
                            <span>{pageNumber}</span>
                        </button>
                    )
                } else {
                    return (
                        <button key={i} className="bg-primary w-8 h-8 rounded text-main flex justify-center items-center">
                            <span>{pageNumber}</span>
                        </button>
                    )
                }
            })}
            <button className={`w-8 h-8 rounded flex justify-center items-center ${Number(meta?.currentPage) >= Number(meta?.totalPages) && "opacity-50"}`} onClick={onNext} disabled={Number(meta?.currentPage) >= Number(meta?.totalPages)}>
                <Icon className="text-2xl" icon="mingcute:right-line" />
            </button>
        </div>
    );
};

export default Pagination;