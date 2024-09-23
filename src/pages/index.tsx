import React, {useEffect, useState} from "react";
import {Faq} from "@/interfaces/Faq";
import faq_id from "@/data/faq_id.json";
import faq_jv from "@/data/faq_jv.json";
import faq_en from "@/data/faq_en.json";
import Input from "@/components/forms/Input";
import Image from "next/image";
import {useTranslation} from "@/utils/useTranslation";
import {useLanguage} from "@/contexts/LanguageContext";
import Skeleton from "@/components/common/Skeleton";

const Home: React.FC = () => {
    const {language} = useLanguage();
    const text = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [filteredFaqs, setFilteredFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let selectedFaqs: Faq[];
        switch (language) {
            case 'id':
                selectedFaqs = faq_id;
                break;
            case 'jv':
                selectedFaqs = faq_jv;
                break;
            case 'en':
                selectedFaqs = faq_en;
                break;
            default:
                selectedFaqs = faq_id;
        }
        setFaqs(selectedFaqs);
        setFilteredFaqs(selectedFaqs.slice(0, 2));
    }, [language]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        if (query === "") {
            setFilteredFaqs(faqs.slice(0, 2));
            return;
        }

        setLoading(true);
        setTimeout(() => {
            const keywords = query.split(/\s+/);

            const matchingFaqs = faqs
                .map((faq) => {
                    const questionWords = faq.question.toLowerCase();
                    const answerWords = faq.answer.toLowerCase();

                    const matchCount = keywords.reduce((count, keyword) => {
                        if (questionWords.includes(keyword) || answerWords.includes(keyword)) {
                            return count + 1;
                        }
                        return count;
                    }, 0);

                    return { ...faq, matchCount };
                })
                .filter(faq => faq.matchCount > 0)
                .sort((a, b) => b.matchCount - a.matchCount);

            if (matchingFaqs.length > 1) {
                const highestMatchCount = matchingFaqs[0].matchCount;
                const secondMatchCount = matchingFaqs[1].matchCount;

                if (secondMatchCount < highestMatchCount * 0.5) {
                    setFilteredFaqs(matchingFaqs.slice(0, 1));
                } else {
                    setFilteredFaqs(matchingFaqs.slice(0, 2));
                }
            }

            setLoading(false);
        }, 1000);
    };


    return (
        <div className="relative">
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div
                    className="relative w-full border border-gray-300 rounded-lg dark:border-gray-600 p-4 flex flex-col gap-4 items-center bg-gray-50 dark:bg-gray-900 shadow-md">
                    <div className="p-4 my-8">
                        <Image
                            src="/default.png"
                            alt="Logo Akmil Office"
                            width={1280}
                            height={728}
                            className="w-72 h-auto"
                            loading="eager"
                            priority={true}
                        />
                    </div>
                    <div className="px-2 text-xl font-bold text-gray-500 dark:text-gray-400 mb-8 text-center">
                        {text('content:promote')}
                    </div>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    className="relative w-full border border-gray-300 rounded-lg dark:border-gray-600 p-4 flex flex-col gap-4 items-center bg-gray-50 dark:bg-gray-900 shadow-md">
                    <div className="px-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                        {text('content:dashboard:multifunction:title')}
                    </div>
                    <svg className="w-36 h-36 text-gray-800 dark:text-gray-400" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M3 11.5h13m-13 0V18a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-6.5m-13 0V9a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2.5M9 5h11a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-1"/>
                    </svg>

                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mx-1 text-center">
                        {text('content:dashboard:multifunction:description')}
                    </p>
                </div>
                <div
                    className="relative w-full border border-gray-300 rounded-lg dark:border-gray-600 p-4 flex flex-col gap-4 items-center bg-gray-50 dark:bg-gray-900 shadow-md">
                    <div className="px-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                        {text('content:dashboard:signature_qr:title')}
                    </div>
                    <svg className="w-36 h-36 text-gray-800 dark:text-gray-400" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2"
                              d="M4 4h6v6H4V4Zm10 10h6v6h-6v-6Zm0-10h6v6h-6V4Zm-4 10h.01v.01H10V14Zm0 4h.01v.01H10V18Zm-3 2h.01v.01H7V20Zm0-4h.01v.01H7V16Zm-3 2h.01v.01H4V18Zm0-4h.01v.01H4V14Z"/>
                        <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2"
                              d="M7 7h.01v.01H7V7Zm10 10h.01v.01H17V17Z"/>
                    </svg>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mx-1 text-center">
                        {text('content:dashboard:signature_qr:description')}
                    </p>
                </div>

                <div className="md:col-span-2 w-full flex justify-center">
                    <div
                        className="relative w-fit border border-gray-300 rounded-lg dark:border-gray-600 p-4 flex flex-col gap-4 items-center bg-gray-50 dark:bg-gray-900 shadow-md">
                        <div className="px-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                            {text('content:dashboard:faq:title')}
                        </div>
                        <svg className="w-36 h-36 text-blue-500 dark:text-blue-800" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mx-auto max-w-2xl w-full text-center">
                            {text('content:dashboard:faq:description')}
                        </p>
                        <div className="max-w-2xl w-full">
                            <Input
                                type="text"
                                label={text('content:dashboard:faq:input_label')}
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder={text('content:dashboard:faq:input_placeholder') + '...'}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid pt-4 text-left border-t border-gray-200 md:gap-4 dark:border-gray-700 md:grid-cols-2">
                {loading ? (
                    <div className="md:col-span-2 pt-4">
                        <Skeleton type="text"/>
                    </div>
                ) : (
                    <>
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                                <div key={index} className="mb-4">
                                    <fieldset
                                        className="relative w-full border border-gray-300 rounded-lg dark:border-gray-600 p-4 flex flex-col gap-4 bg-gray-50 dark:bg-gray-900 shadow-md">
                                        <legend
                                            className="flex items-center px-1 text-sm font-bold text-gray-500 dark:text-gray-400">
                                            <svg
                                                className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            {faq.question}
                                        </legend>
                                        <p className="text-gray-500 dark:text-gray-400">{faq.answer}</p>
                                    </fieldset>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 md:col-span-2 text-center">
                                {text('message:data_not_found')}
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
