import React, { useEffect, useState } from 'react';
import Button from "@/components/common/Button";
import TextArea from "@/components/forms/TextArea";
import Select from "@/components/forms/Select";
import Modal from '@/components/common/Modal';
import SignatureModal from '@/components/common/SignatureModal';
import { IsiDisposisi } from '@/interfaces/LetterIn';
import { getUsers } from '@/storage/userStorage';
import { User } from "@/interfaces/User";
import UserSelection from '@/components/common/UserSelection';
import DisposisiCheckboxList from '@/components/common/DisposisiCheckboxList';
import isi from '@/data/contentDisposition.json';

interface DisposisiModalProps {
    onClose: () => void;
}

const DisposisiModal: React.FC<DisposisiModalProps> = ({ onClose }) => {
    const [note, setNote] = useState('');
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [signature, setSignature] = useState<File | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [disposisiList, setDisposisiList] = useState<IsiDisposisi[]>([]);
    const [selectedDisposisi, setSelectedDisposisi] = useState<string[]>([]); // State for selected disposition contents

    useEffect(() => {
        setUsers(getUsers());
        setDisposisiList(isi);
    }, []);

    const handlePersonChange = (uuid: string) => {
        const user = users.find((user) => user.uuid === uuid);
        if (user && !selectedUsers.some((u) => u.uuid === uuid)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleRemoveUser = (uuid: string) => {
        setSelectedUsers(selectedUsers.filter((user) => user.uuid !== uuid));
    };

    const handleSignatureSubmit = (file: File | null) => {
        setSignature(file);
        setShowSignatureModal(false);
        handleSubmitDisposition();
    };

    const handleSubmitDisposition = () => {
        if (!signature) {
            alert('Please provide a signature to complete the disposition.');
            return;
        }

        onClose();
        alert('Disposition successfully created with signature.');
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
            <div className="flex flex-col gap-2 min-w-96 max-h-[70vh] overflow-y-auto">
                <Select
                    label="Pilih Penerima Disposisi"
                    options={users.map((person: User) => ({
                        label: `${person.name} - ${person.role}`,
                        value: person.uuid,
                    }))}
                    onChange={(value) => handlePersonChange(Array.isArray(value) ? value : value)}
                    value=""
                />
                <UserSelection selectedUsers={selectedUsers} onRemove={handleRemoveUser}/>
                <TextArea
                    label="Catatan"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
                <DisposisiCheckboxList
                    disposisiList={disposisiList}
                    selectedDisposisi={selectedDisposisi}
                    onChange={handleDisposisiChange}
                />

                <Button
                    label="Simpan"
                    onClick={() => setShowSignatureModal(true)}
                    disabled={selectedUsers.length === 0 || selectedDisposisi.length === 0}
                />
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
