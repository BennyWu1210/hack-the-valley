"use client";

import {
  CircleUser,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"


import { useState } from "react";
import { Resume } from "@/utils/schema/ResumeSchema";
import ResumeItem from "@/components/dashboard/ResumeItem";
import Nav from "@/components/nav/Nav";
import Hamburger from "@/components/nav/Hamburger";
ResumeItem

export const description =
  "Resume Dashbaord"

export default function Page() {

  const [resumeList, setResumeList] = useState<Resume[]>([{id: "Meta SWE", name: "Meta SWE", owner: "John", date: new Date(Date.now())}]); // TODO: should be global context later???? 

  const addNewResume = (newItem: Resume) => {
    setResumeList(prev => [...prev, newItem]);
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[260px_1fr] lg:grid-cols-[320px_1fr]">
      <Nav />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Hamburger />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="">
            <h1 className="text-lg font-semibold md:text-2xl">List of Reviews</h1>
            <h3 className="my-2 font-thin">When you review a resume, someone else will also review your’s within 24 hours. </h3>
            <Button>Review a Resume</Button>
          </div>
          <div
            className="flex flex-1 rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
          >

            {resumeList.length > 0 ?
              <div className="w-full p-8 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
                {resumeList.map((resume) => (<ResumeItem key={resume.id} resume={resume} addButton={false} addNewResume={(resume: Resume) => { }} />))}
              </div>
              :
              <div
                className="flex flex-col flex-1 items-center justify-center" x-chunk="dashboard-02-chunk-1"
              >
                <h3 className="text-2xl font-bold tracking-tight">
                  No Review Found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Resumes will appear here once they have been reviewed
                </p>
                <Button className="mt-4" onClick={() => alert("Request Sent!")}>Request Review</Button>
              </div>
            }


          </div>
        </main>
      </div>
    </div>
  )
}
