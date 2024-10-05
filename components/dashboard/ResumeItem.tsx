import { Resume } from "@/utils/schema/ResumeSchema";

export default function ResumeItem({ resume = {id: "dummy", name: "dummy"}, addButton = false, addNewResume = (newItem: Resume) => {} }: { resume: Resume, addButton: boolean, addNewResume: (newItem: Resume) => void }) {
  return (
    <div className="flex flex-col items-center h-56 w-36">
      <div className="h-48 w-36 p-2 rounded-md border border-dashed border-gray-950">
        {!addButton ? resume.name : <div className="flex justify-center items-center w-full h-full text-4xl" onClick={() => addNewResume({id: "bruh", name: "new resume" })}>+</div>}
      </div>
      {resume.id}
    </div>
  );
}