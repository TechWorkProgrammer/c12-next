import React, {useEffect, useState} from 'react';
import client from '@/api/client';
import Input from '@/components/forms/Input';
import Select from '@/components/forms/Select';
import Pagination from '@/components/Pagination';
import Datepicker from "@/components/forms/Datepicker";
import {useDateFormatter} from "@/utils/useDateFormatter";
import ClassificationBadge from "@/components/badges/ClassificationBadge";
import StatusBadge from "@/components/badges/StatusBadge";
import DownloadButton from "@/components/badges/DownloadButton";
import FileDisplay from "@/components/badges/FileDisplay";
import Filter from "@/components/forms/Filter";
import Link from "next/link";
import FloatingButton from "@/components/common/FloatingButton";
import {useRouter} from "next/router";
import {getCurrentUser} from '@/storage/auth';
import {LetterIn} from '@/interfaces/LetterIn';
import {useTranslation} from "@/utils/useTranslation";
import Skeleton from "@/components/common/Skeleton";
import withAuth from "@/hoc/withAuth";

const LettersIn: React.FC = () => {
    const [search, setSearch] = useState('');
    const [classification, setClassification] = useState('');
    const [status, setStatus] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [validatedData, setValidatedData] = useState<LetterIn[]>([]);
    const [filteredData, setFilteredData] = useState<LetterIn[]>([]);
    const [sortOrder, setSortOrder] = useState('default');
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const user = getCurrentUser();
    const text = useTranslation();
    const formatDate = useDateFormatter();

    const classificationOptions = [
        {label: text('all'), value: ''},
        {label: text('secret'), value: 'rahasia'},
        {label: text('regular'), value: 'biasa'},
        {label: text('immediately'), value: 'segera'},
    ];

    const statusOptions = [
        {label: text('all'), value: ''},
        {label: text('read'), value: 'dibaca'},
        {label: text('unread'), value: 'belum dibaca'},
        {label: text('executed'), value: 'dilaksanakan'},
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await client.get('/surat-masuk');
                setValidatedData(response.data);
                setFilteredData(response.data);
            } catch (error:any) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData().then();
    }, []);

    const handleCreate = () => {
        router.push('/letters/in/create').then();
    };

    const getStatus = (item: LetterIn) => {
        const {user_status} = item;
        if (!user_status) {
            return 'undefined';
        } else if (user_status.pelaksanaan_at) {
            return 'dilaksanakan';
        } else if (user_status.read_at) {
            return 'dibaca';
        } else {
            return 'belum dibaca'
        }
    };

    useEffect(() => {
        let sortedData = [...validatedData];

        switch (sortOrder) {
            case 'name-asc':
                sortedData.sort((a, b) => a.nomor_surat.localeCompare(b.nomor_surat));
                break;
            case 'name-desc':
                sortedData.sort((a, b) => b.nomor_surat.localeCompare(a.nomor_surat));
                break;
            case 'date-asc':
                sortedData.sort((a, b) => new Date(a.tanggal_surat).getTime() - new Date(b.tanggal_surat).getTime());
                break;
            case 'date-desc':
                sortedData.sort((a, b) => new Date(b.tanggal_surat).getTime() - new Date(a.tanggal_surat).getTime());
                break;
            default:
                sortedData = [...validatedData];
        }

        const filtered = sortedData.filter((item) => {
            const isDateMatch = selectedDate ? item.tanggal_surat === selectedDate : true;
            const letterStatus = getStatus(item);
            return (
                (item.nomor_surat.toLowerCase().includes(search.toLowerCase()) ||
                    item.creator.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.perihal.toLowerCase().includes(search.toLowerCase()) ||
                    item.pengirim.toLowerCase().includes(search.toLowerCase()))
                &&
                (classification ? item.klasifikasi_surat.name === classification : true) &&
                (status ? letterStatus === status : true) &&
                isDateMatch
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [search, classification, status, selectedDate, sortOrder, validatedData]);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <section className="antialiased">
            {user && user.role === 'Tata Usaha' && (<FloatingButton onClick={handleCreate}/>)}
            <div className="max-w-screen-xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{text('letters_in')}</h1>

                <div className="gap-2 flex lg:flex-row flex-col items-center justify-between">
                    <div className="w-full">
                        <Input
                            label={text('search')}
                            id="search"
                            type="text"
                            placeholder={text("content:search:filter_placeholder")}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 items-end justify-between w-full">
                        <div className="w-full flex flex-row gap-2">
                            <Select
                                label={text('classification')}
                                value={classification}
                                options={classificationOptions}
                                onChange={setClassification}
                            />

                            <Select
                                label={text('status')}
                                value={status}
                                options={statusOptions}
                                onChange={setStatus}
                            />
                        </div>
                        <div className="w-full flex flex-row gap-2 items-end">
                            <Datepicker
                                label={text('date')}
                                selectedDate={selectedDate}
                                onChange={setSelectedDate}
                            />

                            <Filter onSelect={setSortOrder}/>
                        </div>
                    </div>
                </div>

                <div className="my-4">
                    {loading ? (
                        <Skeleton/>
                    ) : paginatedData.length > 0 ? (
                        paginatedData.map((item) => (
                            <Link href={`/letters/in/detail?uuid=${item.uuid}`} key={item.uuid}>
                                <article
                                    className="mb-4 px-2 pt-2 pb-2 lg:px-6 lg:pt-4 lg:pb-3 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-900 dark:border-gray-700">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex justify-start gap-2 items-start text-gray-500">
                                            <ClassificationBadge classification={item.klasifikasi_surat.name}/>
                                            <StatusBadge status={getStatus(item)}/>
                                        </div>
                                        <DownloadButton fileName={item.file_surat} fileUrl={item.file_surat}/>
                                    </div>
                                    <FileDisplay fileName={item.file_surat} label={item.nomor_surat}/>
                                    <h1 className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                        {item.perihal}
                                    </h1>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-xs text-gray-500 dark:text-gray-500">
                                            {item.creator.name} | {text('send_by')} {item.pengirim}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-500">
                                            {formatDate(item.tanggal_surat)}
                                        </span>
                                    </div>
                                </article>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">{text('message:data_not_found')}</p>
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

export default withAuth(LettersIn, ["Tata Usaha", "Pejabat", "Pelaksana"]);
