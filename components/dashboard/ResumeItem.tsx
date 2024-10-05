import { Resume } from "@/utils/schema/ResumeSchema";

export default function ResumeItem({ resume, addButton = false, addNewResume = (newItem: Resume) => {} }: { resume: Resume, addButton: boolean, addNewResume: (newItem: Resume) => void }) {
  return (
    <div className="flex flex-col items-center h-64 w-40">
      <div className={`h-52 w-40 p-2 rounded-md border ${addButton ? "border-dashed" : ""} hover:border-primary border-gray-950`}>
        {!addButton ? resume.name : <div className="flex justify-center items-center w-full h-full text-4xl" onClick={() => addNewResume({id: "bruh", name: "new resume", date: new Date(Date.now())})}>+</div>}
      </div>
      <span>{resume.id}</span>
      {!addButton && <span className="font-light text-xs">{resume.date.toDateString()}</span>}
    </div>
  );
}