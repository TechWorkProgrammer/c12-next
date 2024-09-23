import React from 'react';
import Checkbox from '@/components/forms/Checkbox';
import { IsiDisposisi } from '@/interfaces/LetterIn';

interface DisposisiCheckboxListProps {
    disposisiList: IsiDisposisi[];
    selectedDisposisi: string[];
    onChange: (id: string) => void;
}

const DisposisiCheckboxList: React.FC<DisposisiCheckboxListProps> = ({ disposisiList, selectedDisposisi, onChange }) => {
    return (
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-2">
            {disposisiList.map((disposisi) => (
                <Checkbox
                    key={disposisi.uuid}
                    id={disposisi.uuid}
                    label={disposisi.isi}
                    checked={selectedDisposisi.includes(disposisi.uuid)}
                    onChange={() => onChange(disposisi.uuid)}
                />
            ))}
        </div>
    );
};

export default DisposisiCheckboxList;
