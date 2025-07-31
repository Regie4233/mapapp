'use client';

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import UserBadge from "../ViewSessions/UserBadge";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { updateUser } from "@/lib/store/states/sessionsSlice";

export default function AccountView() {
  const authUser = useAppSelector(state => state.sessions.authUser);
  const dispatch = useAppDispatch();

  const [editMode, setEditMode] = useState(false);

  // Form state
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [about, setAbout] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (authUser) {
      setFirstname(authUser.firstname || '');
      setLastname(authUser.lastname || '');
      setAbout(authUser.about || '');
      setPhone(authUser.phone || '');
    }
  }, [authUser]);

  const handleCancel = () => {
    if (!authUser) return;
    // Reset form fields to original values
    setFirstname(authUser.firstname || '');
    setLastname(authUser.lastname || '');
    setAbout(authUser.about || '');
    setPhone(authUser.phone || '');
    setAvatarFile(null);
    setEditMode(false);
  };

  const handleSave = async () => {
    if (!authUser) return;

    const toastId = toast.loading("Updating profile...");
    try {
      const formData = new FormData();
      formData.append('firstname', firstname);
      formData.append('lastname', lastname);
      formData.append('about', about);
      formData.append('phone', phone);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      // NOTE: `updateUser` is an async thunk that should be defined in your sessionsSlice.
      // It should handle the API call to update the user in PocketBase.
      const resultAction = await dispatch(updateUser({ userId: authUser.id, userData: formData }));

      if (updateUser.fulfilled.match(resultAction)) {
        toast.success("Profile updated successfully.", { id: toastId });
        setEditMode(false);
        setAvatarFile(null);
      } else {
        const errorMessage = resultAction.payload as string || "Update failed. Please try again.";
        toast.error(errorMessage, { id: toastId });
      }
    } catch (error: any) {
      toast.error(`An error occurred: ${error.message}`, { id: toastId });
    }
  };

  if (!authUser) {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2 flex-grow">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <UserBadge size={96} initials={[firstname[0] || 'A', lastname[0] || 'A']} person={authUser} tooltip={false} />
          <div className="grid sm:grid-cols-2 gap-4 w-full">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="firstname">First Name</Label>
              {editMode ? <Input id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} /> : <p className="p-2">{firstname}</p>}
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="lastname">Last Name</Label>
              {editMode ? <Input id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} /> : <p className="p-2">{lastname}</p>}
            </div>
          </div>
        </div>

        <div className="grid w-full gap-1.5">
          <Label htmlFor="email">Email</Label>
          <p className="p-2 text-muted-foreground">{authUser.email}</p>
        </div>

        <div className="grid w-full gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          {editMode ? <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" /> : <p className="p-2">{phone || 'Not provided'}</p>}
        </div>

        <div className="grid w-full gap-1.5">
          <Label htmlFor="about">About</Label>
          {editMode ? <Textarea id="about" value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Tell us a little about yourself" className="min-h-[120px]" /> : <p className="p-2 whitespace-pre-wrap min-h-[60px]">{about || 'Not provided'}</p>}
        </div>

        {editMode && (
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="avatar">Update Avatar</Label>
            <Input id="avatar" type="file" onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)} />
          </div>
        )}

        <div className="mt-8 flex justify-end gap-4">
          {editMode ? (
            <>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
          )}
        </div>
      </div>
    </div>
  )
}
