"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Resume } from "@/utils/schema/ResumeSchema";
import { randomUUID } from "crypto";

export default function ResumeItem({ resume, addButton = false, addNewResume = (newItem: Resume) => { } }: { resume: Resume, addButton: boolean, addNewResume: (newItem: Resume) => void }) {
  const [newResume, setNewResume] = useState<Resume>({ id: crypto.randomUUID(), name: "", date: new Date(), link: "" });

  const handleInputChange = (event: any) => {
    setNewResume({ ...newResume, [event.target.name]: event.target.value });
  };

  const handleAddResume = () => {
    setNewResume({ id: crypto.randomUUID(), name: "", date: new Date(), link: "" })
    addNewResume(newResume);
  };

  const component = <div className="flex flex-col items-center h-64 w-40">
    <div className={`h-52 w-40 p-2 rounded-md border ${addButton ? "border-dashed" : ""} hover:border-primary border-gray-950`}>
      {!addButton ? resume.name : <div className="flex justify-center items-center w-full h-full text-4xl">+</div>}
    </div>
    <span>{resume.name}</span>
    {!addButton && <span className="font-light text-xs">{resume.date.toDateString()}</span>}
  </div>;

  return <>
    {addButton ? (

      <Dialog>
        <DialogTrigger asChild>
          {component}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Job Application</DialogTitle>
            <DialogDescription>
              Customize your job application!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" placeholder="Meta Software Engineer III" value={newResume.name} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Link
              </Label>
              <Input id="link" name="link" placeholder="linkedin.com/postings/.." value={newResume.link} onChange={handleInputChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button onClick={handleAddResume}>Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ) : component}
  </>;
}
