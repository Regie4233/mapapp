"use client"
import { useState, useEffect } from 'react';
import { getPocketBase } from '@/lib/server/pocketbase';

const pb = getPocketBase();

interface DocumentProps {
    collectionName: string;
    fileName: string;
}

const Document: React.FC<DocumentProps> = ({ collectionName, fileName }) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const record = await pb.collection(collectionName).getFirstListItem(`name="${fileName}"`);
                if (record && record.file) {
                    const url = pb.files.getURL(record, record.file);
                    setFileUrl(url);
                } else {
                    setError('File not found.');
                }
            } catch (err) {
                setError('Error fetching file.');
                console.error(err);
            }
        };

        fetchFile();
    }, [collectionName, fileName]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!fileUrl) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <iframe src={fileUrl} width="100%" height="600px" />
        </div>
    );
};

export default Document;
