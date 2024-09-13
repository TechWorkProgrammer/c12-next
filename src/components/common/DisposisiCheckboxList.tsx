import React from 'react';
import Checkbox from '@/components/forms/Checkbox';
import { IsiDisposisi } from '@/interfaces/LetterIn';

interface DisposisiCheckboxListProps {
    disposisiList: IsiDisposisi[];
    selectedDisposisi: string[];
    onChange: (id: string) => void;
}

const DisposisiCheckboxList: React.FC<DisposisiCheckboxListProps> = ({ disposisiList, selectedDisposisi, onChange }) => {
    const half = Math.ceil(disposisiList.length / 2);
    const leftColumn = disposisiList.slice(0, half);
    const rightColumn = disposisiList.slice(half);

    return (
        <div className="flex gap-4">
            <div className="flex flex-col">
                {leftColumn.map((disposisi) => (
                    <Checkbox
                        key={disposisi.uuid}
                        id={disposisi.uuid}
                        label={disposisi.isi}
                        checked={selectedDisposisi.includes(disposisi.uuid)}
                        onChange={() => onChange(disposisi.uuid)}
                    />
                ))}
            </div>
            <div className="flex flex-col">
                {rightColumn.map((disposisi) => (
                    <Checkbox
                        key={disposisi.uuid}
                        id={disposisi.uuid}
                        label={disposisi.isi}
                        checked={selectedDisposisi.includes(disposisi.uuid)}
                        onChange={() => onChange(disposisi.uuid)}
                    />
                ))}
            </div>
        </div>
    );
};

export default DisposisiCheckboxList;
