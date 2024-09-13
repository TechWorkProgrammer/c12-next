import React, { FC, useEffect, useState } from 'react';
import FileInput from '@/components/forms/FileInput';
import Select from '@/components/forms/Select';
import Button from '@/components/common/Button';
import { useAlert } from '@/contexts/AlertContext';
import Textarea from "@/components/forms/TextArea";
import { addLetterIn, Klasifikasi } from '@/interfaces/letterIn';
import { getUsers } from "@/storage/userStorage";
import { User } from "@/interfaces/User";
import Datepicker from '@/components/forms/Datepicker';

const createDummyKlasifikasi = (name: Klasifikasi['name']): Klasifikasi => {
    return {
        uuid: `uuid-${Math.random().toString(36)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name,
    };
};

const classifications = [
    createDummyKlasifikasi('biasa'),
    createDummyKlasifikasi('segera'),
    createDummyKlasifikasi('rahasia'),
];

const LetterInCreate: FC = () => {
    const [letterData, setLetterData] = useState<addLetterIn>({
        file_surat: null,
        klasifikasi_surat: createDummyKlasifikasi('biasa'),
        tanggal_surat: new Date().toISOString(),
        created_by: {} as User,
        perihal: '',
        penerima: {} as User,
    });

    const alert = useAlert();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        setUsers(getUsers());
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLetterData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFileChange = (file: File | null) => {
        setLetterData(prevState => ({ ...prevState, file_surat: file }));
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

    const handleUserChange = (type: 'created_by' | 'penerima') => (value: string) => {
        const selectedUser = users.find((user) => user.uuid === value);
        if (selectedUser) {
            setLetterData(prevState => ({ ...prevState, [type]: selectedUser }));
        }
    };

    const handleDateChange = (date: string) => {
        setLetterData(prevState => ({ ...prevState, tanggal_surat: date }));
    };

    const handleSubmit = () => {
        if (letterData.file_surat) {
            alert.success('Surat berhasil dibuat');
        } else {
            alert.danger('Silakan unggah file untuk membuat surat');
        }
    };

    const isFormComplete =
        letterData.file_surat &&
        letterData.klasifikasi_surat &&
        letterData.perihal &&
        letterData.created_by.uuid &&
        letterData.penerima.uuid;

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <section className="flex-1 p-4 overflow-hidden border border-gray-300 bg-gray-50 shadow-md dark:bg-gray-800 rounded-lg dark:border-gray-600 h-fit w-full">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Buat Surat Masuk</h2>
                <FileInput onChange={handleFileChange} />
            </section>
            <aside className="w-full lg:w-1/3 border border-gray-300 rounded-lg dark:border-gray-600 p-4 bg-gray-50 shadow-md dark:bg-gray-800">
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
                    <Textarea
                        label="Keterangan Surat"
                        name="perihal"
                        value={letterData.perihal}
                        onChange={handleInputChange}
                        placeholder="Masukan Keterangan Surat"
                        rows={4}
                    />
                    <Select
                        label="Dibuat Oleh"
                        value={letterData.created_by.uuid || ''}
                        options={users.map((user) => ({ label: user.name, value: user.uuid }))}
                        onChange={handleUserChange('created_by')}
                    />
                    <Select
                        label="Penerima Pertama"
                        value={letterData.penerima.uuid || ''}
                        options={users.map((user) => ({ label: user.name, value: user.uuid }))}
                        onChange={handleUserChange('penerima')}
                    />
                    <Button label="Turunkan Surat" onClick={handleSubmit} disabled={!isFormComplete} />
                </div>
            </aside>
        </div>
    );
};

export default LetterInCreate;
