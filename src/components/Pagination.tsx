import React, {FC} from 'react';
import Select from '@/components/forms/Select';
import {useTranslation} from "@/utils/useTranslation";

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (value: number) => void;
}

const itemsPerPageOptions = [
    {label: '5', value: '5'},
    {label: '10', value: '10'},
    {label: '20', value: '20'},
    {label: '50', value: '50'},
    {label: '100', value: '100'},
];

const Pagination: FC<PaginationProps> = ({
                                             totalItems,
                                             itemsPerPage,
                                             currentPage,
                                             onPageChange,
                                             onItemsPerPageChange,
                                         }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const text = useTranslation();

    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full items-center justify-between">
            <div className="w-full sm:w-auto">
                <Select
                    label={text('content:item_per_page')}
                    value={itemsPerPage.toString()}
                    options={itemsPerPageOptions}
                    onChange={(value) => onItemsPerPageChange(Number(value))}
                />
            </div>
            <div className="flex gap-2 items-center justify-center w-full sm:w-auto">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700 disabled:opacity-50"
                >
                    <svg
                        className="w-6 h-6 text-gray-700 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m15 19-7-7 7-7"
                        />
                    </svg>
                </button>

                <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {text('page')} {currentPage} {text('from').toLowerCase()} {totalPages}
                </span>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700 disabled:opacity-50"
                >
                    <svg
                        className="w-6 h-6 text-gray-700 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m9 5 7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
