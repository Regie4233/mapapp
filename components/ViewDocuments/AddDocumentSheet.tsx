import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Textarea } from "../ui/textarea";

const AddDocumentSheet = ({ isOpen, setOpen, categories, onUploadSuccess }: { isOpen: boolean, setOpen: (args: boolean) => void, categories: string[], onUploadSuccess: () => void }) => {
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState<string>("");
    const [newCateName, setNewCateName] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [desc, setDesc] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleReset =() => {
        setFile(null);
        setCategory("");
        setNewCateName("");
        setTitle("");
        setDesc("");
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file || !category) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);
        formData.append("title", title);
        formData.append("description", desc);
        if (category === 'new') {
            formData.append("newCateTitle", newCateName);
        }

        const res = await fetch("/api/documents/upload", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            console.log("File uploaded successfully");
            setOpen(false);
            onUploadSuccess();
        } else {
            console.error("File upload failed");
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetContent onCloseAutoFocus={() => handleReset()}>
                <SheetHeader>
                    <SheetTitle>Add Document</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="p-4 border rounded-lg mt-4">
                    <h2 className="text-xl font-bold mb-4">Upload Document</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input type="file" onChange={handleFileChange}/>
                        <Input type='text' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
                        <Textarea placeholder='Description' onChange={(e) => setDesc(e.target.value)} value={desc}/>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                        <Select onValueChange={setCategory} value={category}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="w-fit">
                                <SelectItem value="new"> <Plus size={30} />New Category</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {
                            category === 'new' && <Input type='text' onChange={(e) => setNewCateName(e.target.value)} className="border-2 border-[#3e5a89] rounded" placeholder='Enter category Name' />
                        }
                    </div>
                    <Button type="submit" className="mt-4">Upload</Button>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export default AddDocumentSheet;