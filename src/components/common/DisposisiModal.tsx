import React, {useEffect, useState} from 'react';
import Button from "@/components/common/Button";
import TextArea from "@/components/forms/TextArea";
import Select from "@/components/forms/Select";
import Modal from '@/components/common/Modal';
import SignatureModal from '@/components/common/SignatureModal';
import {DetailLetterIn, Disposisi, DisposisiLevel2, IsiDisposisi} from '@/interfaces/LetterIn';
import {User} from "@/interfaces/User";
import UserSelection from '@/components/common/UserSelection';
import DisposisiCheckboxList from '@/components/common/DisposisiCheckboxList';
import client from '@/api/client';
import {useAlert} from "@/contexts/AlertContext";
import Skeleton from '@/components/common/Skeleton';
import {useTranslation} from "@/utils/useTranslation";

interface DisposisiModalProps {
    onClose: () => void;
    letter: DetailLetterIn | null;
    parentDisposisi?: Disposisi | DisposisiLevel2 | null;
    level: string;
}

const DisposisiModal: React.FC<DisposisiModalProps> = ({onClose, letter, parentDisposisi = null, level = ''}) => {
    const [note, setNote] = useState('');
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [disposisiList, setDisposisiList] = useState<IsiDisposisi[]>([]);
    const [selectedDisposisi, setSelectedDisposisi] = useState<string[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const alert = useAlert();
    const text = useTranslation();

    useEffect(() => {
        const fetchDisposisiData = async () => {
            try {
                setIsLoadingData(true);
                const response = await client.get('/disposisi/create');
                setUsers(response.data.penerima);
                setDisposisiList(response.data.isi_disposisi);
            } catch (error) {
                alert.warning('Failed to fetch disposition data.');
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchDisposisiData().then();
    }, [letter, alert]);

    const handlePersonChange = (uuid: string) => {
        const user = users.find((user) => user.uuid === uuid);
        if (user && !selectedUsers.some((u) => u.uuid === uuid)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleRemoveUser = (uuid: string) => {
        setSelectedUsers(selectedUsers.filter((user) => user.uuid !== uuid));
    };

    const handleDisposisiChange = (id: string) => {
        if (selectedDisposisi.includes(id)) {
            setSelectedDisposisi(selectedDisposisi.filter((d) => d !== id));
        } else {
            setSelectedDisposisi([...selectedDisposisi, id]);
        }
    };

    return (
        <Modal label={level != '' ? text('next_from') + ' ' + text(level) : text('create_new_disposition')}
               isOpen={true}
               onClose={onClose}>
            {isLoadingData ? (
                <div className="flex flex-col gap-2 w-full min-w-[20rem] max-w-screen-xl">
                    <Skeleton/>
                </div>
            ) : (
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
            )}

            {showSignatureModal && (
                <SignatureModal
                    isOpen={showSignatureModal}
                    onClose={onClose}
                    selectedUsers={selectedUsers}
                    selectedDisposisi={selectedDisposisi}
                    note={note}
                    letter={letter}
                    parentDisposisi={parentDisposisi}
                />
            )}
        </Modal>
    );
};

export default DisposisiModal;
