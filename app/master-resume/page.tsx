"use client";

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Resume } from "@/utils/schema/ResumeSchema";
import Nav from "@/components/nav/Nav";
import Hamburger from "@/components/nav/Hamburger";
import { CircleUser } from "lucide-react";
import { useRef, useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import "react-pdf/dist/esm/Page/TextLayer.css";

export const description =
  "Resume Dashbaord"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function MasterResume() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const addButton: Resume = { id: "Add button", name: "Add button", date: new Date(Date.now()), link: "" }

  return (
    <div className="grid min-h-screen max-h-screen overflow-hidden w-full md:grid-cols-[260px_1fr] lg:grid-cols-[320px_1fr]">
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
        <main className="flex flex-1 flex-col gap-8 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center w-full">
            <h1 className="text-lg font-semibold md:text-2xl w-full">Master Resume</h1>
          </div>
          <div
            className="flex flex-1 rounded-lg border border-dashed overflow-y-scroll shadow-sm" x-chunk="dashboard-02-chunk-1"
          >
            {
              !file ?
                <div
                  className="flex flex-col flex-1 items-center justify-center" x-chunk="dashboard-02-chunk-1"
                >
                  <h3 className="text-2xl font-bold tracking-tight">
                    You have no resume added
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Create your first resume to get started
                  </p>
                  <Button className="mt-4" onClick={handleButtonClick}>Upload Master Resume</Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div> :
                <>
                  <Document className="pl-8" file={file} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page height={700} pageNumber={pageNumber} />
                  </Document>
                  <div className="p-5 gap-2">
                    <p>Page {pageNumber} of {numPages}</p>
                    <Button className="m-1" onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}>Previous</Button>
                    <Button className="m-1" onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= numPages!}>Next</Button>
                  </div>
                </>

            }
          </div>
        </main>
      </div>
    </div>
  )
}
