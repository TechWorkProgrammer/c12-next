import React, {FC} from 'react';

interface InputProps {
    id?: string;
    label?: string | null;
    name?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

const Input: FC<InputProps> = ({
                                   id,
                                   name = "input",
                                   label = null,
                                   type = 'text',
                                   placeholder,
                                   required,
                                   value = '',
                                   onChange,
                                   disabled = false,
                               }) => {
    return (
        <fieldset className="relative w-full border border-gray-300 rounded-lg dark:border-gray-600">
            <legend className="mx-2 px-1 text-sm font-bold text-gray-500 dark:text-gray-400">
                {label ? label : 'Input'}
            </legend>
            <input
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="bg-inherit border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 pt-1 outline-none dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 appearance-none"
            />
        </fieldset>
    );
};

export default Input;
