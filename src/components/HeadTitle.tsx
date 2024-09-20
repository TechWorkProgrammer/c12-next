import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRouteName } from "@/utils/useRouteName";
import { useTranslation } from "@/utils/useTranslation";

const HeadTitle: React.FC = () => {
    const router = useRouter();
    const initialTitle = useRouteName(router.pathname);
    const [pageTitle, setPageTitle] = useState(`${initialTitle} | SPARTI`);
    const text = useTranslation();

    useEffect(() => {
        setPageTitle(`${text(initialTitle.toLowerCase())} | SPARTI`);
    }, [initialTitle, text]);

    return (
        <Head>
            <title>{pageTitle}</title>
        </Head>
    );
};

export default HeadTitle;
