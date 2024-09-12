import React, {FC, useState} from 'react';
import FileInput from '@/components/forms/FileInput';
import Input from '@/components/forms/Input';
import Select from '@/components/forms/Select';
import Button from '@/components/common/Button';
import {useAlert} from '@/contexts/AlertContext';
import users from '@/data/users.json';
import Textarea from "@/components/forms/TextArea";

interface LetterData {
    noSurat: string;
    classification: string;
    keteranganSurat: string;
    createdBy: string;
    role: string;
    recipient: string;
    file: File | null;
}

const classifications = [
    {label: 'Biasa', value: 'biasa'},
    {label: 'Segera', value: 'segera'},
    {label: 'Rahasia', value: 'rahasia'},
];

const roles = [
    {label: 'Kabag', value: 'kabag'},
    {label: 'Dan', value: 'dan'},
];

const LetterInCreate: FC = () => {
    const [letterData, setLetterData] = useState<LetterData>({
        noSurat: '',
        classification: 'biasa',
        keteranganSurat: '',
        createdBy: '',
        role: '',
        recipient: '',
        file: null,
    });

    const alert = useAlert();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setLetterData({...letterData, [name]: value});
    };

    const handleFileChange = (file: File | null) => {
        setLetterData({...letterData, file});
    };

    const handleRoleChange = (value: string) => {
        setLetterData({...letterData, role: value, recipient: ''});
    };

    const handleRecipientChange = (value: string) => {
        setLetterData({...letterData, recipient: value});
    };

    const handleClassificationChange = (value: string) => {
        setLetterData({...letterData, classification: value});
    };

    const handleSubmit = () => {
        if (letterData.file) {
            console.log('Letter created:', letterData);
            alert.success('Letter created successfully');
        } else {
            alert.danger('Please upload a file to create a letter');
        }
    };

    const isFormComplete =
        letterData.classification &&
        letterData.keteranganSurat &&
        letterData.createdBy &&
        letterData.role &&
        letterData.recipient &&
        letterData.file;

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <section
                className="flex-1 p-4 overflow-hidden border border-gray-300 bg-gray-50 shadow-md dark:bg-gray-800 rounded-lg dark:border-gray-600 h-fit w-full">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Buat Surat Masuk</h2>
                <FileInput onChange={handleFileChange}/>
            </section>
            <aside
                className="w-full lg:w-1/3 border border-gray-300 rounded-lg dark:border-gray-600 p-4 bg-gray-50 shadow-md dark:bg-gray-800">
                <div className="space-y-3">
                    <Input
                        label="No Surat"
                        name="noSurat"
                        disabled={true}
                        value={letterData.noSurat}
                        onChange={handleInputChange}
                        placeholder="No Surat Akan Automatis dibuat"
                        required
                    />
                    <Select
                        label="Klasifikasi"
                        value={letterData.classification}
                        options={classifications}
                        onChange={handleClassificationChange}
                    />
                    <Textarea
                        label="Keterangan Surat"
                        name="keteranganSurat"
                        value={letterData.keteranganSurat}
                        onChange={handleInputChange}
                        placeholder="Masukan Keterangan Surat"
                        rows={4}
                    />
                    <Select
                        label="Dibuat Oleh"
                        value={letterData.createdBy}
                        options={users.map((user) => ({label: user.name, value: user.id}))}
                        onChange={(value) => setLetterData({...letterData, createdBy: value})}
                    />
                    <Select
                        label="Role"
                        value={letterData.role}
                        options={roles}
                        onChange={handleRoleChange}
                    />
                    <Select
                        label="Penerima Pertama"
                        value={letterData.recipient}
                        options={users
                            .filter((user) => user.role === letterData.role)
                            .map((user) => ({label: user.name, value: user.id}))}
                        onChange={handleRecipientChange}
                        disabled={!letterData.role}
                    />
                    <h6 className="px-2 text-sm text-gray-500 dark:text-gray-300">* No surat bisa di isi jika ingin
                        kustomisasi.
                    </h6>
                    <Button
                        label="Turunkan Surat"
                        onClick={handleSubmit}
                        disabled={!isFormComplete}
                    />
                </div>
            </aside>
        </div>
    );
};

export default LetterInCreate;
