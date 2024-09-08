import React, {useEffect, useState} from 'react';
import Input from '@/components/forms/Input';
import Select from '@/components/forms/Select';
import Pagination from '@/components/Pagination';
import data from '@/data/letters.json';
import Datepicker from "@/components/forms/Datepicker";
import {dateFormatter} from "@/utils/dateFormatter";
import ClassificationBadge from "@/components/badges/ClassificationBadge";
import StatusBadge from "@/components/badges/StatusBadge";
import DownloadButton from "@/components/badges/DownloadButton";
import FileDisplay from "@/components/badges/FileDisplay";
import Filter from "@/components/forms/Filter";
import Link from "next/link";

const classificationOptions = [
    {label: 'Semua', value: ''},
    {label: 'Rahasia', value: 'rahasia'},
    {label: 'Biasa', value: 'biasa'},
    {label: 'Segera', value: 'segera'},
];

const statusOptions = [
    {label: 'Semua', value: ''},
    {label: 'Dibaca', value: 'dibaca'},
    {label: 'Belum Dibaca', value: 'belum dibaca'},
    {label: 'Disposisi 1', value: 'disposisi 1'},
    {label: 'Disposisi 2', value: 'disposisi 2'},
    {label: 'Disposisi 3', value: 'disposisi 3'},
];

const LettersIn: React.FC = () => {
    const [search, setSearch] = useState('');
    const [classification, setClassification] = useState('');
    const [status, setStatus] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(data);
    const [sortOrder, setSortOrder] = useState('default');

    useEffect(() => {
        let sortedData = [...data];

        switch (sortOrder) {
            case 'name-asc':
                sortedData.sort((a, b) => a.fileName.localeCompare(b.fileName));
                break;
            case 'name-desc':
                sortedData.sort((a, b) => b.fileName.localeCompare(a.fileName));
                break;
            case 'date-asc':
                sortedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                break;
            case 'date-desc':
                sortedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                break;
            default:
                sortedData = [...data];
        }

        const filtered = sortedData.filter((item) => {
            const isDateMatch = selectedDate ? new Date(item.date).toISOString().slice(0, 10) === selectedDate : true;
            return (
                item.fileName.toLowerCase().includes(search.toLowerCase()) &&
                (classification ? item.classification === classification : true) &&
                (status ? item.status === status : true) &&
                isDateMatch
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [search, classification, status, selectedDate, sortOrder]);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <section className="antialiased">
            <div className="max-w-screen-lg mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Surat Masuk</h1>
                <div className="gap-4 flex lg:flex-row flex-col items-center justify-between">
                    <div className="w-full">
                        <Input
                            label="Pencarian"
                            id="search"
                            type="text"
                            placeholder="Cari berdasarkan nama surat"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 items-end justify-between w-full">
                        <div className="w-full flex flex-row gap-2">
                            <Select
                                label='Klasifikasi'
                                value={classification}
                                options={classificationOptions}
                                onChange={setClassification}
                            />

                            <Select
                                label='Status'
                                value={status}
                                options={statusOptions}
                                onChange={setStatus}
                            />
                        </div>
                        <div className="w-full flex flex-row gap-2 items-end">
                            <Datepicker
                                label='Tanggal'
                                onChange={(date) => setSelectedDate(date)}
                            />

                            <Filter onSelect={setSortOrder}/>
                        </div>
                    </div>
                </div>

                <div className="my-4">
                    {paginatedData.length > 0 ? (
                        paginatedData.map((item) => (
                            <Link href={`/letters/in/detail?id=${item.id}`} key={item.id}>
                                <article key={item.id}
                                         className="mb-4 px-6 pt-4 pb-3 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-900 dark:border-gray-700">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex justify-start gap-2 items-start text-gray-500">
                                            <ClassificationBadge classification={item.classification}/>
                                            <StatusBadge status={item.status}/>
                                        </div>
                                        <DownloadButton label={true} fileName={item.fileName} fileUrl={item.fileUrl}/>
                                    </div>
                                    <FileDisplay fileName={item.fileName} label={item.keteranganSurat}/>
                                    <div className="flex justify-between items-center">
                                        <span
                                            className="text-xs text-gray-500 dark:text-gray-500">{item.createdBy}</span>
                                        <span
                                            className="text-xs text-gray-500 dark:text-gray-500">{dateFormatter(item.createdAt)}</span>
                                    </div>
                                </article>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">Tidak ada data yang sesuai.</p>
                    )}
                </div>

                <Pagination
                    totalItems={filteredData.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            </div>
        </section>
    );
};

export default LettersIn;
