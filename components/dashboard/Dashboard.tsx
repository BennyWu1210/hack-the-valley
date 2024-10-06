"use client";

import Link from "next/link";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { Resume } from "@/utils/schema/ResumeSchema";
import ResumeItem from "./ResumeItem";
import Hamburger from "../nav/Hamburger";
import Nav from "../nav/Nav";
import { useGlobalContext } from "@/app/GlobalContext";
import { useRouter } from "next/navigation";

export const description = "Resume Dashbaord";

export default function Dashboard() {
  const router = useRouter(); // using next/navigation
  const { resumeList, setResumeList } = useGlobalContext();

  const addNewResume = (newItem: Resume) => {
    setResumeList([...resumeList, newItem]);
    if (newItem.id != "Add button") router.push("/generate/1");
  };

  const addButton: Resume = {
    id: "Add button",
    name: "Add button",
    date: new Date(Date.now()),
    link: "",
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[260px_1fr] lg:grid-cols-[320px_1fr]">
      <Nav />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Hamburger />
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
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
        <main className="flex flex-1 flex-col gap-8 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Resume List</h1>
          </div>
          <div
            className="flex flex-1 rounded-lg border border-dashed shadow-sm"
            x-chunk="dashboard-02-chunk-1"
          >
            {resumeList.length > 0 ? (
              <div className="w-full p-8 grid gap-2 grid-cols-[repeat(auto-fill,minmax(170px,1fr))]">
                {resumeList.map((resume) => (
                  <ResumeItem
                    key={resume.id}
                    resume={resume}
                    addButton={resume.id === "Add button"}
                    addNewResume={addNewResume}
                  />
                ))}
              </div>
            ) : (
              <div
                className="flex flex-col flex-1 items-center justify-center"
                x-chunk="dashboard-02-chunk-1"
              >
                <h3 className="text-2xl font-bold tracking-tight">
                  You have no resume added
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create your first resume to get started
                </p>
                <Button
                  className="mt-4"
                  onClick={() => addNewResume(addButton)}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
