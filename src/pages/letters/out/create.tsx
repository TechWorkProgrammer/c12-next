import React, { FC, useEffect, useState } from 'react';
import FileInput from '@/components/forms/FileInput';
import Input from '@/components/forms/Input';
import Select from '@/components/forms/Select';
import Button from '@/components/common/Button';
import { useAlert } from '@/contexts/AlertContext';
import { addLetterOut } from '@/interfaces/LetterOut';
import { getUsers } from '@/storage/userStorage';
import Datepicker from '@/components/forms/Datepicker';
import { User } from '@/interfaces/User';

const LetterOutCreate: FC = () => {
    const [letterData, setLetterData] = useState<addLetterOut>({
        file_surat: null,
        tanggal_surat: new Date().toISOString(),
        perihal: '',
        penerima: {} as User,
        created_at: '',
        updated_at: '',
        uuid: '',
    });

    const alert = useAlert();
    const [users, setUsers] = useState<User[]>(getUsers());

    useEffect(() => {
        setUsers(getUsers());
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLetterData({ ...letterData, [name]: value });
    };

    const handleFileChange = (file: File | null) => {
        setLetterData({ ...letterData, file_surat: file });
    };

    const handlePenerimaChange = (value: string) => {
        const selectedUser = users.find((user) => user.uuid === value);
        if (selectedUser) {
            setLetterData({ ...letterData, penerima: selectedUser });
        }
    };

    const handleDateChange = (date: string) => {
        setLetterData({ ...letterData, tanggal_surat: date });
    };

    const handleSubmit = () => {
        if (letterData.file_surat) {
            alert.success('Surat keluar berhasil dibuat');
        } else {
            alert.danger('Silakan unggah file untuk membuat surat keluar');
        }
    };

    const isFormComplete =
        letterData.file_surat &&
        letterData.perihal &&
        letterData.penerima &&
        letterData.tanggal_surat;

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <section className="flex-1 p-4 overflow-hidden border border-gray-300 bg-gray-50 shadow-md dark:bg-gray-800 rounded-lg dark:border-gray-600 h-fit w-full">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Buat Surat Keluar</h2>
                <FileInput onChange={handleFileChange} />
            </section>
            <aside className="w-full lg:w-1/3 border border-gray-300 rounded-lg dark:border-gray-600 p-4 bg-gray-50 shadow-md dark:bg-gray-800">
                <div className="space-y-3">
                    <Datepicker
                        label="Tanggal Surat"
                        selectedDate={letterData.tanggal_surat}
                        onChange={handleDateChange}
                    />
                    <Input
                        label="Perihal"
                        name="perihal"
                        value={letterData.perihal}
                        onChange={handleInputChange}
                        placeholder="Masukan perihal surat"
                        required
                    />
                    <Select
                        label="Penerima"
                        value={letterData.penerima?.uuid || ''}
                        options={users.map((user) => ({ label: user.name, value: user.uuid }))}
                        onChange={handlePenerimaChange}
                    />
                    <Button label="Ajukan Surat" onClick={handleSubmit} disabled={!isFormComplete} />
                </div>
            </aside>
        </div>
    );
};

export default LetterOutCreate;
