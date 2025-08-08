import { useEffect, useState } from 'react';
import CategoryCard from './CategoryCard';
import { Button } from '@/components/ui/button';
import { DocumentCategory, DocumentFile } from '@/lib/type';
import { AddDocumentButton } from './AddDocumentButton';
import AddDocumentSheet from './AddDocumentSheet';
import { useAppSelector } from '@/lib/hooks';
import { downloadFile } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

const DocumentsView = () => {
    const [documents, setDocuments] = useState<DocumentCategory[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const authUser = useAppSelector(state => state.sessions.authUser);

    const fetchDocuments = async () => {
        const res = await fetch('/api/documents');
        const data = await res.json();
        setDocuments(data.items);
        const uniqueCategories = Array.from(new Set(data.items.map((doc: DocumentCategory) => doc.categoryName)));
        setCategories(uniqueCategories as string[]);
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
    };

    const handleBackClick = () => {
        setSelectedCategory(null);
    };

    const handleDeleteCategory = async (category: string) => {
        const res = await fetch(`/api/documents/category/${category}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            fetchDocuments();
        } else {
            console.error("Failed to delete category");
        }
    };

    const documentsForSelectedCategory = selectedCategory
        ? documents.find((doc) => doc.categoryName === selectedCategory)?.expand.files
        : [];

    return (
        <div className="p-4">
            {selectedCategory ? (
                <div>
                    <Button onClick={handleBackClick} className="mb-4">Back to Categories</Button>
                    <h1 className="text-2xl font-bold mb-4">{selectedCategory}</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documentsForSelectedCategory?.map((doc: DocumentFile) => (
                            <div key={doc.id} className="flex flex-col gap-2 p-4 border rounded-lg">
                                <p className="font-bold">{doc.title}</p>
                                <p>{doc.description}</p>
                                {/* DO NOT REMOVE THE DOWNLOAD BUTTON BELOW */}
                                <Button className='w-fit self-end' onClick={() => downloadFile(doc)}>
                                    Download
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Document Categories</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {categories.map((category) => (
                            <div key={category} className="flex flex-row gap-2 justify-between">
                                <CategoryCard category={category} onClick={() => handleCategoryClick(category)}/>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className='w-fit'>
                                        <MoreVertical />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleDeleteCategory(category)}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                        ))}
                    </div>
                </div>
            )}

            {authUser?.privilage === 'admin' || authUser?.privilage === 'manager' ? (
                <section className='w-full fixed bottom-0 bg-white py-5 border-t-2 border-[#E2E8F0]'>
                    <AddDocumentButton setOpen={setOpen} />
                    <AddDocumentSheet isOpen={open} setOpen={setOpen} categories={categories} onUploadSuccess={fetchDocuments} />
                </section>
            ) : null}
        </div>
    );
};

export default DocumentsView;