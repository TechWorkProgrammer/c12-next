import React, {FC} from 'react';

interface TextareaProps {
    id?: string;
    name?: string;
    label?: string | null;
    placeholder?: string;
    required?: boolean;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    disabled?: boolean;
    rows?: number;
}

const Textarea: FC<TextareaProps> = ({
                                         id,
                                         name = "textarea",
                                         label = null,
                                         placeholder,
                                         required,
                                         value,
                                         onChange,
                                         disabled = false,
                                         rows = 1,
                                     }) => {
    return (
        <fieldset className="relative w-full border border-gray-300 rounded-lg dark:border-gray-600">
            <legend className="mx-2 px-1 text-sm font-bold text-gray-500 dark:text-gray-400">
                {label ? label : 'Textarea'}
            </legend>
            <textarea
                id={id}
                name={name}
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
                disabled={disabled}
                rows={rows}
                className="bg-inherit border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 pt-1 outline-none dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
        </fieldset>
    );
};

export default Textarea;
