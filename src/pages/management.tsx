import React from "react";
import withAuth from "@/hoc/withAuth";

const Management: React.FC = () => {
    return (
        <>
            <div className="flex justify-between items-center">
                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Management</h2>
            </div>
        </>
    );
};

export default withAuth(Management, ['Administrator']);
