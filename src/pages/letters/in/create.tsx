import React, {FC, useEffect, useState} from 'react';
import FileInput from '@/components/forms/FileInput';
import Select from '@/components/forms/Select';
import Button from '@/components/common/Button';
import {useAlert} from '@/contexts/AlertContext';
import Textarea from "@/components/forms/TextArea";
import {addLetterIn, Klasifikasi} from '@/interfaces/LetterIn';
import {User} from "@/interfaces/User";
import Datepicker from '@/components/forms/Datepicker';
import client from '@/api/client';
import Input from '@/components/forms/Input';
import {useLoader} from "@/contexts/LoadingContext";
import {useRouter} from "next/router";
import {useTranslation} from "@/utils/useTranslation";
import withAuth from "@/hoc/withAuth";

const LetterInCreate: FC = () => {
    const [letterData, setLetterData] = useState<addLetterIn>({
        file_surat: null,
        klasifikasi_surat: {} as Klasifikasi,
        tanggal_surat: '',
        pengirim: '',
        perihal: '',
        penerima: {} as User,
    });

    const alert = useAlert();
    const router = useRouter();
    const loading = useLoader();
    const text = useTranslation();
    const [users, setUsers] = useState<User[]>([]);
    const [classifications, setClassifications] = useState<Klasifikasi[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await client.get('/surat-masuk/create');
                const {users, classifications} = response.data;
                setUsers(users);
                setClassifications(classifications);
            } catch (error) {
                console.log('Failed to load data, please try again.');
            }
        };
        fetchInitialData().then();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setLetterData(prevState => ({...prevState, [name]: value}));
    };

    const handleFileChange = (file: File | null) => {
        setLetterData(prevState => ({...prevState, file_surat: file}));
    };

    const handleClassificationChange = (value: string) => {
        const selectedClassification = classifications.find((item) => item.name === value);
        if (selectedClassification) {
            setLetterData(prevState => ({
                ...prevState,
                klasifikasi_surat: selectedClassification,
            }));
        }
    };

    const handleUserChange = (value: string) => {
        const selectedUser = users.find((user) => user.uuid === value);
        if (selectedUser) {
            setLetterData(prevState => ({...prevState, penerima: selectedUser}));
        }
    };

    const handleDateChange = (date: string) => {
        setLetterData(prevState => ({...prevState, tanggal_surat: date}));
    };

    const handleSubmit = async () => {
        if (!letterData.file_surat) {
            alert.danger('Silakan unggah file untuk membuat surat');
            return;
        }

        const formData = new FormData();
        formData.append('file_surat', letterData.file_surat);
        formData.append('klasifikasi_surat_id', letterData.klasifikasi_surat.uuid);
        formData.append('tanggal_surat', letterData.tanggal_surat);
        formData.append('pengirim', letterData.pengirim);
        formData.append('perihal', letterData.perihal);
        formData.append('penerima_id', letterData.penerima.uuid);

        try {
            loading(true);
            await client.post('/surat-masuk', formData);
            loading(false);
            alert.success('Surat berhasil dibuat', true, undefined, () => {
                router.push('/letters/in').then();
            });
        } catch (error: any) {
            loading(false);
            alert.danger(error.message || "Gagal Upload Surat");
        }
    };

    const isFormComplete =
        letterData.file_surat &&
        letterData.klasifikasi_surat &&
        letterData.perihal &&
        letterData.pengirim &&
        letterData.penerima.uuid;

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <section
                className="flex-1 p-4 overflow-hidden border border-gray-300 bg-gray-50 shadow-md dark:bg-gray-800 rounded-lg dark:border-gray-600 h-fit w-full">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{text('content:letters_in:create:label')}</h2>
                <FileInput onChange={handleFileChange}/>
            </section>
            <aside
                className="w-full lg:w-1/3 border border-gray-300 rounded-lg dark:border-gray-600 p-4 bg-gray-50 shadow-md dark:bg-gray-800">
                <div className="space-y-3">
                    <Datepicker
                        label="Tanggal Surat"
                        selectedDate={letterData.tanggal_surat}
                        onChange={handleDateChange}
                    />
                    <Select
                        label="Klasifikasi"
                        value={letterData.klasifikasi_surat.name}
                        options={classifications.map((classification) => ({
                            label: classification.name,
                            value: classification.name,
                        }))}
                        onChange={handleClassificationChange}
                    />
                    <Input
                        label="Pengirim"
                        name="pengirim"
                        value={letterData.pengirim}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama pengirim"
                    />
                    <Select
                        label="Penerima Pertama"
                        value={letterData.penerima.uuid || ''}
                        options={users.map((user) => ({label: user.name + ' - ' + user.jabatan, value: user.uuid}))}
                        onChange={handleUserChange}
                    />
                    <Textarea
                        label="Keterangan Surat"
                        name="perihal"
                        value={letterData.perihal}
                        onChange={handleInputChange}
                        placeholder="Masukan Keterangan Surat"
                        rows={4}
                    />
                    <Button label="Turunkan Surat" onClick={handleSubmit} disabled={!isFormComplete}/>
                </div>
            </aside>
        </div>
    );
};

export default withAuth(LetterInCreate, ["Tata usaha", "Pejabat", "Pelaksana"]);
