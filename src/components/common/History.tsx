import React, { useState } from 'react';
import { dateFormatter } from '@/utils/dateFormatter';
import Select from "@/components/forms/Select";

const History = ({ disposisi }) => {
    const [filterPerson, setFilterPerson] = useState('all');

    const actions = disposisi.flatMap((level) =>
        level.accepted.flatMap((accept) => [
            accept.readAt && {
                type: 'read',
                date: accept.readAt,
                description: `${accept.name} membaca surat disposisi level ${level.level} dari ${level.disposisiBy}.`,
                person: accept.name,
            },
            accept.disposisiAt && {
                type: 'disposisi',
                date: accept.disposisiAt,
                description: `${accept.name} melakukan disposisi level ${level.level}.`,
                person: accept.name,
            },
            accept.pelaksanaanAt && {
                type: 'pelaksanaan',
                date: accept.pelaksanaanAt,
                description: `${accept.name} melaksanakan tugas pada level ${level.level}.`,
                person: accept.name,
            },
            level.disposisiAt && {
                type: 'received',
                date: level.disposisiAt,
                description: `${accept.name} menerima disposisi level ${level.level} dari ${level.disposisiBy}.`,
                person: accept.name,
            },
        ].filter(Boolean))
    );

    const sortedActions = actions.sort((a, b) => new Date(a.date) - new Date(b.date));

    const groupedActions = sortedActions.reduce((acc, action) => {
        const date = dateFormatter(action.date);
        if (!acc[date]) acc[date] = [];
        acc[date].push(action);
        return acc;
    }, {});

    const uniqueNames = Array.from(new Set(sortedActions.map(action => action.person)));

    // Prepare filter options
    const selectOptions = [
        { label: 'Semua Orang', value: 'all' },
        ...uniqueNames.map(name => ({ label: name, value: name }))
    ];

    // Filter actions based on selected person
    const filteredActions = filterPerson === 'all'
        ? groupedActions
        : Object.fromEntries(
            Object.entries(groupedActions).map(([date, actions]) => [
                date,
                actions.filter(action => action.person === filterPerson),
            ]).filter(([_, actions]) => actions.length > 0)
        );

    return (
        <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex flex-col gap-2 lg:flex-row justify-between items-center mx-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white w-full">Log Surat</h3>
                <Select
                    label="Filter Berdasarkan Penerima"
                    value={filterPerson}
                    options={selectOptions}
                    onChange={(value) => setFilterPerson(value)}
                />
            </div>

            {Object.entries(filteredActions).map(([date, actions], index) => (
                <ol key={index} className="relative border-l border-gray-200 dark:border-gray-700 mx-8">
                    <li className="ms-6 pb-4">
                        <span
                            className="absolute -left-2 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:bg-blue-900 dark:ring-blue-900">
                            <svg className="h-4 w-4 text-blue-800 dark:text-blue-300" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
                            </svg>
                        </span>
                        <span
                            className="inline-flex items-center rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {date}
                        </span>
                        {actions.map((action, idx) => (
                            <div key={idx} className="mt-2">
                                <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-300">
                                    {action.description}
                                </h3>
                            </div>
                        ))}
                    </li>
                </ol>
            ))}
        </div>
    );
};

export default History;
