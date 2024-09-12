import React, { useState } from 'react';
import { dateFormatter } from '@/utils/dateFormatter';
import Select from "@/components/forms/Select";
import StatusBadge from "@/components/badges/StatusBadge";

const History = ({ letter }) => {
    const { disposisi, fileName } = letter;
    const [filterPerson, setFilterPerson] = useState('all');
    const [showRecipients, setShowRecipients] = useState({});

    const toggleRecipients = (levelUuid) => {
        setShowRecipients((prev) => ({
            ...prev,
            [levelUuid]: !prev[levelUuid],
        }));
    };

    const actions = [
        {
            type: 'received',
            date: letter.accepted[0]?.readAt,
            description: `${letter.accepted[0]?.name} menerima surat ${fileName}`,
            person: letter.accepted[0]?.name,
        },
        {
            type: 'read',
            date: letter.accepted[0]?.readAt,
            description: `${letter.accepted[0]?.name} membaca surat ${fileName}`,
            person: letter.accepted[0]?.name,
        },
        ...disposisi.flatMap((level) =>
            level.accepted.flatMap((accept) => [
                accept.readAt && {
                    type: 'read',
                    date: accept.readAt,
                    description: `${accept.name} membaca surat ${fileName} dengan disposisi level ${level.level} dari ${level.disposisiBy.name}.`,
                    person: accept.name,
                },
                accept.pelaksanaanAt && {
                    type: 'pelaksanaan',
                    date: accept.pelaksanaanAt,
                    description: `${accept.name} melaksanakan tugas pada level ${level.level}.`,
                    person: accept.name,
                },
            ].filter(Boolean))
        ),
        ...disposisi.map((level) => ({
            type: 'disposisi',
            date: level.disposisiAt,
            description: `${level.disposisiBy.name} membuat disposisi level ${level.level} dan diterima oleh ${level.accepted.length} orang.`,
            person: level.disposisiBy.name,
            levelUuid: level.uuid,
        })),
    ];

    const sortedActions = actions.sort((a, b) => new Date(a.date) - new Date(b.date));

    const groupedActions = sortedActions.reduce((acc, action) => {
        const date = dateFormatter(action.date);
        if (!acc[date]) acc[date] = [];
        acc[date].push(action);
        return acc;
    }, {});

    const uniqueNames = Array.from(new Set(sortedActions.map((action) => action.person)));

    const selectOptions = [
        { label: 'Semua Orang', value: 'all' },
        ...uniqueNames.map((name) => ({ label: name, value: name }))
    ];

    const filteredActions = filterPerson === 'all'
        ? groupedActions
        : Object.fromEntries(
            Object.entries(groupedActions).map(([date, actions]) => [
                date,
                actions.filter(action => action.person === filterPerson),
            ]).filter(([_, actions]) => actions.length > 0)
        );

    return (
        <div className="p-4 border border-gray-300 rounded-lg dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex flex-col gap-2 lg:flex-row justify-between items-center mx-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white w-full">Log Surat</h3>
                <Select
                    label="Filter Berdasarkan Penerima"
                    value={filterPerson}
                    options={selectOptions}
                    onChange={(value) => setFilterPerson(value)}
                />
            </div>
            <ol className="relative border-s border-gray-300 dark:border-gray-700 mx-2 lg:mx-8">
                {Object.entries(filteredActions).map(([date, actions], index) => (
                    <li key={index} className="mb-6 ms-6">
                        <span
                            className="absolute -start-2.5 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-800">
                            <svg className="h-3 w-3 text-green-800 dark:text-green-300" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
                            </svg>
                        </span>
                        <span
                            className="inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-blue-900 dark:text-green-100">
                            {date}
                        </span>
                        {actions.map((action, idx) => (
                            <div key={idx} className="mt-1">
                                <p className="text-base lg:text-sm font-semibold text-gray-800 dark:text-gray-300">
                                    {action.description}
                                </p>
                                {action.levelUuid && (
                                    <button
                                        onClick={() => toggleRecipients(action.levelUuid)}
                                        className="text-sm text-blue-500 hover:underline"
                                    >
                                        Lihat penerima
                                    </button>
                                )}
                                {showRecipients[action.levelUuid] && (
                                    <ul className="ml-4 mt-2">
                                        {disposisi.find(d => d.uuid === action.levelUuid)?.accepted.map(recipient => {
                                            // Determine the status based on the recipient's actions
                                            const status = recipient.pelaksanaanAt
                                                ? 'dilaksanakan'
                                                : recipient.disposisiAt
                                                    ? `disposisi level ${disposisi.find(d => d.accepted.some(a => a.uuid === recipient.uuid))?.level || ''}`
                                                    : recipient.readAt
                                                        ? 'dibaca'
                                                        : 'belum dibaca';

                                            // Format the date associated with the current status
                                            const date = recipient.pelaksanaanAt || recipient.disposisiAt || recipient.readAt;

                                            return (
                                                <li key={recipient.uuid} className="flex items-center mb-2">
                                                    <StatusBadge status={status} />
                                                    <span className="ml-2">{recipient.name}</span>
                                                    {date && (
                                                        <span className="ml-2 text-xs text-gray-500">
                                                            {dateFormatter(date)}
                                                        </span>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default History;
