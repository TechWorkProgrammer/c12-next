import React, {useEffect, useState} from 'react';
import Button from "@/components/common/Button";
import TextArea from "@/components/forms/TextArea";
import Select from "@/components/forms/Select";
import Modal from '@/components/common/Modal';
import SignatureModal from '@/components/common/SignatureModal';
import {DetailLetterIn, IsiDisposisi} from '@/interfaces/LetterIn';
import {User} from "@/interfaces/User";
import UserSelection from '@/components/common/UserSelection';
import DisposisiCheckboxList from '@/components/common/DisposisiCheckboxList';
import client from '@/api/client';
import {useAlert} from "@/contexts/AlertContext";

interface DisposisiModalProps {
    onClose: () => void;
    letter: DetailLetterIn | null;
}

const DisposisiModal: React.FC<DisposisiModalProps> = ({onClose, letter}) => {
    const [note, setNote] = useState('');
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [signature, setSignature] = useState<File | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [disposisiList, setDisposisiList] = useState<IsiDisposisi[]>([]);
    const [selectedDisposisi, setSelectedDisposisi] = useState<string[]>([]);
    const alert = useAlert();

    useEffect(() => {
        const fetchDisposisiData = async () => {
            try {
                const response = await client.get('/disposisi/create');
                console.log(response)
                setUsers(response.data.penerima);
                setDisposisiList(response.data.isi_disposisi);
            } catch (error) {
                console.error('Failed to fetch recipients and disposition contents:', error);
            }
        };

        fetchDisposisiData().then();
    }, [letter]);

    const handlePersonChange = (uuid: string) => {
        const user = users.find((user) => user.uuid === uuid);
        if (user && !selectedUsers.some((u) => u.uuid === uuid)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleRemoveUser = (uuid: string) => {
        setSelectedUsers(selectedUsers.filter((user) => user.uuid !== uuid));
    };

    const handleSignatureSubmit = async (file: File | null) => {
        await setSignature(file);
        setShowSignatureModal(false);
        handleSubmitDisposition().then();
    };

    const handleSubmitDisposition = async () => {
        if (!signature) {
            alert.warning('Please provide a signature to complete the disposition.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('catatan', note);
            formData.append('tanda_tangan', signature);
            selectedDisposisi.forEach((id) => formData.append('isi_disposisi_id[]', id));
            selectedUsers.forEach((user) => formData.append('penerima[]', user.uuid));

            await client.post(`/surat-masuk/${letter?.uuid}/disposisi`, formData);

            alert.success('Disposition successfully created with signature.');
            onClose();
        } catch (error) {
            alert.warning('Failed to create disposition. Please try again.');
            console.error(error);
        }
    };

    const handleDisposisiChange = (id: string) => {
        if (selectedDisposisi.includes(id)) {
            setSelectedDisposisi(selectedDisposisi.filter((d) => d !== id));
        } else {
            setSelectedDisposisi([...selectedDisposisi, id]);
        }
    };

    return (
        <Modal label="Form Disposisi" isOpen={true} onClose={onClose}>
            <div className="flex flex-col gap-2 w-full min-w-[20rem] max-w-screen-xl max-h-[70vh] overflow-y-auto">
                <DisposisiCheckboxList
                    disposisiList={disposisiList}
                    selectedDisposisi={selectedDisposisi}
                    onChange={handleDisposisiChange}
                />
                <Select
                    label="Pilih Penerima Disposisi"
                    options={users.map((person: User) => ({
                        label: `${person.name} - ${person.pejabat ? person.pejabat.name : person.role}`,
                        value: person.uuid,
                    }))}
                    onChange={(value) => handlePersonChange(Array.isArray(value) ? value : value)}
                    value=""
                />
                <UserSelection selectedUsers={selectedUsers} onRemove={handleRemoveUser}/>
                <TextArea
                    label="Catatan"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
                <div className="mt-4">
                    <Button
                        label="Simpan"
                        onClick={() => setShowSignatureModal(true)}
                        disabled={selectedUsers.length === 0 || selectedDisposisi.length === 0}
                    />
                </div>
            </div>

            {showSignatureModal && (
                <SignatureModal
                    isOpen={showSignatureModal}
                    onClose={() => setShowSignatureModal(false)}
                    onSignatureSubmit={handleSignatureSubmit}
                />
            )}
        </Modal>
    );
};

export default DisposisiModal;
