import { useState, useEffect } from 'react';
import { ShiftLocation } from '@/lib/type';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface SiteDetailsSheetProps {
  site: ShiftLocation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSiteUpdate: (updatedSite: ShiftLocation) => void;
  onSiteDelete: (siteId: string) => void;
}

export default function SiteDetailsSheet({ site, open, onOpenChange, onSiteUpdate, onSiteDelete }: SiteDetailsSheetProps) {
  const [formData, setFormData] = useState({ name: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = site !== null;

  useEffect(() => {
    if (open) {
      if (isEditMode) {
        setFormData({ name: site.name, address: site.address });
      } else {
        setFormData({ name: '', address: '' });
      }
    }
  }, [site, open, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      toast.error("Please fill out all fields.");
      return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading(isEditMode ? 'Updating site...' : 'Creating site...');

    try {
      const response = await fetch('/api/locations', {
        method: isEditMode ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEditMode ? { id: site.id, ...formData } : formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An unexpected error occurred.');
      }

      const updatedSite = await response.json();
      onSiteUpdate(updatedSite);
      toast.success(`Site successfully ${isEditMode ? 'updated' : 'created'}.`, { id: toastId });
      onOpenChange(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast.error(message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!site) return;
    setIsSubmitting(true);
    const toastId = toast.loading('Deleting site...');

    try {
      const response = await fetch('/api/locations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: site.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete site.');
      }

      onSiteDelete(site.id);
      toast.success('Site deleted.', { id: toastId });
      onOpenChange(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete site.';
      toast.error(message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-lg p-0 bg-white flex flex-col sm:max-w-md" side="right">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-xl font-semibold">{isEditMode ? 'Edit Site' : 'Add New Site'}</SheetTitle>
          <SheetDescription>
            {isEditMode ? 'Update the details for this site.' : 'Fill in the information to create a new site.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <Label htmlFor="name">Site Name</Label>
              <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Main Campus" required disabled={isSubmitting} />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={formData.address} onChange={handleInputChange} placeholder="e.g., 123 University Ave, City, ST 12345" required disabled={isSubmitting} />
            </div>

            {isEditMode && (
              <div className="border-t pt-6 mt-4">
                <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" type="button" disabled={isSubmitting}>Delete Site</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the site.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={isSubmitting}>
                        {isSubmitting ? 'Deleting...' : 'Continue'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <p className="text-xs text-gray-500 mt-1">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            )}
          </div>
          <SheetFooter className="p-6 border-t mt-auto flex flex-row justify-end gap-2">
            <SheetClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
            </SheetClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}