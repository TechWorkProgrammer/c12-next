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
import Skeleton from "@/components/common/Skeleton";

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
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmiting, setIsSubmiting] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (users.length === 0) {
                try {
                    const response = await client.get('/surat-masuk/create');
                    const {users, classifications} = response.data;
                    setUsers(users);
                    setClassifications(classifications);
                } catch (error: any) {
                    console.log(text('message:data_fetch_failed'));
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchInitialData().then();
    }, [text, users]);

    if (isLoading) return <Skeleton/>

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
        loading(true);
        setIsSubmiting(true);
        if (!letterData.file_surat) {
            loading(false);
            setIsSubmiting(false);
            alert.danger(text('message:upload_file_prompt'));
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
            await client.post('/surat-masuk', formData);
            alert.success(text('message:letter_creation_success'), true, undefined, () => {
                router.push('/letters/in').then();
            });
        } catch (error: any) {
            alert.danger(error.message || text('message:letter_creation_failed'));
        } finally {
            loading(false);
            setIsSubmiting(false);
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
                        label={text('date')}
                        selectedDate={letterData.tanggal_surat || ''}
                        onChange={handleDateChange}
                    />
                    <Select
                        label={text('classification')}
                        value={letterData.klasifikasi_surat.name}
                        options={classifications.map((classification) => ({
                            label: text(classification.name),
                            value: classification.name,
                        }))}
                        onChange={handleClassificationChange}
                    />
                    <Input
                        label={text('sender')}
                        name="pengirim"
                        value={letterData.pengirim}
                        onChange={handleInputChange}
                        placeholder={text('message:letter_sender_prompt')}
                    />
                    <Select
                        label={text('recipient')}
                        value={letterData.penerima.uuid || ''}
                        options={users.map((user) => ({label: user.name + ' - ' + user.jabatan, value: user.uuid}))}
                        onChange={handleUserChange}
                    />
                    <Textarea
                        label={text('description')}
                        name="perihal"
                        value={letterData.perihal}
                        onChange={handleInputChange}
                        placeholder={text('message:letter_description_prompt')}
                        rows={4}
                    />
                    <Button label={text('generate_letter')} onClick={handleSubmit} disabled={!isFormComplete && isSubmiting}/>
                </div>
            </aside>
        </div>
    );
};

export default withAuth(LetterInCreate, ["Tata Usaha", "Pejabat", "Pelaksana"]);
