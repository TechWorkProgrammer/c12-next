import React from 'react';
import { User } from '@/interfaces/User';

interface UserSelectionProps {
    selectedUsers: User[];
    onRemove: (uuid: string) => void;
}

const UserSelection: React.FC<UserSelectionProps> = ({ selectedUsers, onRemove }) => {
    return (
        <div className="flex flex-col gap-2">
            {selectedUsers.map((user) => (
                <div
                    key={user.uuid}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 p-2 rounded flex items-center justify-between"
                >
                    <span>{user.name}</span>
                    <button
                        onClick={() => onRemove(user.uuid)}
                        className="ml-2 text-gray-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-600"
                    >
                        &times;
                    </button>
                </div>
            ))}
        </div>
    );
};

export default UserSelection;
