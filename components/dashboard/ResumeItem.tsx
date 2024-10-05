import { Resume } from "@/utils/schema/ResumeSchema";

export default function ResumeItem({ resume, addButton = false, addNewResume = (newItem: Resume) => {} }: { resume: Resume, addButton: boolean, addNewResume: (newItem: Resume) => void }) {
  return (
    <div className="flex flex-col items-center h-60 w-36">
      <div className="h-48 w-36 p-2 rounded-md border border-dashed border-gray-950">
        {!addButton ? resume.name : <div className="flex justify-center items-center w-full h-full text-4xl" onClick={() => addNewResume({id: "bruh", name: "new resume", date: new Date(Date.now())})}>+</div>}
      </div>
      <span>{resume.id}</span>
      {!addButton && <span className="font-light text-xs text-gray-700">{resume.date.toDateString()}</span>}

    </div>
  );
}