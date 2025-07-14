// components/AddShiftSheet.tsx

"use client";

import { useEffect, useState } from "react";
import { Calendar1Icon, Minus, Plus, X } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { format } from "date-fns";
import {  UserPool } from "@/lib/type";
import { createShift } from "@/lib/store/states/sessionsSlice";


const AvatarPlaceholder = () => (
  <div className="h-10 w-10 rounded-full bg-gray-200" />
);


// A reusable styled form group component to keep the code DRY
const FormGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-2 pb-5 border-b border-dotted border-blue-200">
    {children}
  </div>
);

export function AddShiftSheet() {
  const [spots, setSpots] = useState(2);
  const [date, setDate] = useState<Date>(new Date());
  const [assignedMentors, setAssignedMentors] = useState<UserPool[]>([]);
  const [shiftTitle, setShitTitle] = useState<string>("");
  const [shiftLocation, setShiftLocation] = useState<string>("");
  const [shiftStart, setShiftStart] = useState<string>("17:00:00");
  const [shiftEnd, setShiftEnd] = useState<string>("18:00:00");
  // const [targetedUser, setTargetedUser] = useState<UserPool | null>(null);
  // const [targetShift, setTargetShift] = useState<Shift | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const mentors = useAppSelector(state => state.sessions.allMentors);
  const locations = useAppSelector(state => state.sessions.allLocations);
  const incrementSpots = () => setSpots((prev) => prev + 1);
  const decrementSpots = () => setSpots((prev) => (prev > 1 ? prev - 1 : 1));
 const dispatch = useAppDispatch();
  const unassignedMentors = mentors.filter(m => !assignedMentors.some(am => am.id === m.id));

  // const handleUserClick = (user: UserPool) => {
  //   setTargetedUser(user);
  //   // setTargetShift(shiftData);
  // };
  // const handleCloseDrawer = () => {
  //   setTargetedUser(null);
  // };
  const handleCreate = () => {
    const data = {
      title: shiftTitle,
      location: shiftLocation,
      date: date,
      shift_start: shiftStart,
      shift_end: shiftEnd,
      spots: spots,
      mentorID: assignedMentors

    }
    dispatch(createShift(data))
    console.log(data)
    setShitTitle("");
    setShiftLocation("");
    setDate(new Date)
    setShiftStart("17:00:00");
    setShiftEnd("18:00:00");
    setSpots(2);
    setAssignedMentors([]);
  };

  const handleRemove = (user: UserPool) => {
    setAssignedMentors(prev => prev.filter(mentor => mentor.id !== user.id));
  }

  useEffect(() => {
    console.log(assignedMentors)
  }, [assignedMentors])

  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* You can use the "Add a shift" button from the previous step here */}
        <Button variant="outline">Open Add Shift Form</Button>
      </SheetTrigger>

      {/* Set a max-width to match the design */}
      <SheetContent side="right" className="w-full max-w-md p-0 bg-white">
        <ScrollArea className="h-[98vh] relative">
          <SheetHeader className="p-6 border-b border-gray-200 sticky top-0 bg-[#F5F6F7] z-10 ">
            <SheetTitle className="text-2xl font-semibold text-gray-900">
              Add a shift
            </SheetTitle>
            {/* The default close button is hidden, we use our own styled one */}
            <SheetClose className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </SheetHeader>

          {/* Main form content with vertical padding */}
          <div className="px-6 py-4 space-y-5">
            <FormGroup>
              <Label htmlFor="shift-name" className="text-gray-800">Shift Name</Label>
              <Input id="shift-name" value={shiftTitle} onChange={(e) => setShitTitle(e.target.value)} className="rounded-lg py-7 border-2 border-slate-200 shadow-none" />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="site" className="text-gray-800">Site</Label>
              <Select onValueChange={(value) => setShiftLocation(value)} value={shiftLocation}>
                <SelectTrigger id="site" className="rounded-lg w-full py-7 border-2 border-slate-200 shadow-none">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {
                    locations.map((location, idx) => <SelectItem value={location.name} key={idx}>{location.name}</SelectItem>)
                  }
                </SelectContent>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="date" className="text-gray-800">Date</Label>
              {/* <Input id="date" type="date" placeholder="00-00-0000" className="rounded-lg w-full py-7 border-2 border-slate-200 shadow-none" /> */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!date}
                    className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal rounded-lg w-full py-7 border-2 border-slate-200 shadow-none"
                  >
                    <Calendar1Icon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} required onSelect={setDate} />
                </PopoverContent>
              </Popover>
            </FormGroup>

            <FormGroup>
              <Label className="text-gray-800">Time</Label>
              <div className="flex items-center space-x-2">
                <Input type="time" value={shiftStart} onChange={(e) => setShiftStart(e.target.value)} className="rounded-lg text-center w-full py-6 border-2 border-slate-200 shadow-none" />
                <span className="text-gray-500">to</span>
                <Input type="time" value={shiftEnd} onChange={(e) => setShiftEnd(e.target.value)} className="rounded-lg text-center w-full py-6 border-2 border-slate-200 shadow-none" />
              </div>
            </FormGroup>

            <FormGroup>
              <Label className="text-gray-800">Available spots</Label>
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  onClick={decrementSpots}
                  className="bg-gray-200 text-gray-800 h-10 w-10 rounded-md hover:bg-gray-300"
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="text-lg font-medium text-gray-800 w-4 text-center">{spots}</span>
                <Button
                  type="button"
                  onClick={incrementSpots}
                  className="bg-gray-200 text-gray-800 h-10 w-10 rounded-md hover:bg-gray-300"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </FormGroup>

            {/* Last item without the bottom border */}
            <section className="space-y-2">
              <Label htmlFor="mentors" className="text-gray-800">Assign mentors</Label>
              <ul className="space-y-2 pb-2">
                {assignedMentors.map(mentor => (
                  <li key={mentor.id} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                      <AvatarPlaceholder />
                      <span>{mentor.firstname} {mentor.lastname}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(mentor)} className="h-6 w-6">
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
              <Command className="mb-12">
                <CommandInput placeholder="Search for a mentor to assign..." value={searchQuery} onValueChange={setSearchQuery} />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {searchQuery.length > 0 &&
                      unassignedMentors.map((mentor) => (
                        <CommandItem
                          key={mentor.id}
                          value={mentor.firstname}
                          className="p-2 mb-2 bg-white border border-gray-200/80 rounded-xl shadow-sm"
                          onSelect={(currentValue) => {
                            const mentorToAdd = unassignedMentors.find((m) => m.firstname === currentValue);
                            if (mentorToAdd) {
                              setAssignedMentors((prev) => [...prev, mentorToAdd]);
                              setSearchQuery("");
                            }
                          }}
                        >
                          <div className="mb-1 flex items-center gap-2">
                            <AvatarPlaceholder />
                            <span className="font-medium">{mentor.firstname} {mentor.lastname}</span>
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </section>
          </div>
          <SheetFooter className="pt-6 relative">
            <Button
              type="submit"
              onClick={() => handleCreate()}
              className="fixed bottom-3 bg-[#4A6A9A] text-white font-bold w-11/12 m-auto py-6 rounded-md text-base hover:bg-[#3e5a89] focus:ring-[#4A6A9A]">
              Create shift
            </Button>
          </SheetFooter>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}