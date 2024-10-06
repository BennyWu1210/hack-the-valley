import { Editor as TinyMCEEditor } from 'tinymce';

const accentColor = '#169179';

// Interfaces
interface ContactInformation {
  email: string;
  github: string;
  linkedin: string;
  name: string;
  website: string;
}

interface Education {
  degree: string;
  description: string;
  graduation_year: string;
  institution: string;
  starting_year: string;
}

interface Experience {
  company: string;
  description: string;
  end_date: string;
  job_title: string;
  location: string;
  start_date: string;
}

interface Project {
  project_name: string;
  description: string;
  end_date: string;
  start_date: string;
  technologies_used: string[];
}

interface Blocks {
  contact_information: ContactInformation;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  professional_summary: string;
  programinglanguages: string[];
  technologies: string[];
}

// Helper functions to generate each section
function generateHeader(content: ContactInformation) {
  return `<h1 style="text-align: center;">${content.name}</h1><p style="text-align: center;"><strong><span style="text-decoration: underline; color: ${accentColor};">${content.email}</span></strong> |<span style="color: ${accentColor};"> </span><strong><span style="text-decoration: underline; color: ${accentColor};">${content.website}</span></strong> | <strong><span style="text-decoration: underline; color: ${accentColor};">${content.github}</span></strong> |<strong><span style="text-decoration: underline; color: ${accentColor};"> ${content.linkedin}</span></strong></p>`;
}

function generateEducation(content: Education[]) {
  const education = content[0];
  const header = `<p style="text-align: left;"><span style="color: ${accentColor};"><strong>Education _________________________________________________________________________________________________________</strong></span></p>`;

  return header + `<div style="display: flex; justify-content: space-between; align-items: center;">
    <strong>${education.institution}</strong>
    <span><strong>${education.degree} &middot; ${education.starting_year} &ndash; ${education.graduation_year}</strong></span>
  </div>
  <p>${education.description}</p>`;
}

function generateExperience(content: Experience[]) {
  const header = `<p style="text-align: left;"><span style="color: ${accentColor};"><strong>Experience _______________________________________________________________________________________________________</strong></span></p>`;

  const formatDescription = (description: string) => {
    const bulletPoints = description.split(/(?: - |•|\n)/).filter(point => point.trim() !== '');
    return bulletPoints.map(point => `<p dir="ltr">${point.trim()}</p>`).join('\n');
  };

  return header + content.map(exp => 
    `<div style="display: flex; justify-content: space-between; align-items: center;">
      <strong>${exp.company}</strong>
      <span><strong>${exp.job_title} | ${exp.location} | ${exp.end_date}</strong></span>
    </div>
    ${formatDescription(exp.description)}`
  ).join('\n');
}

function generateProjects(content: Project[]): string {
  const header = `<p style="text-align: left;"><span style="color: ${accentColor};"><strong>Projects __________________________________________________________________________________________________________</strong></span></p>`;

  const formatDescription = (description: string): string => {
    const bulletPoints = description.split(/(?: - |•|\n)/).filter(point => point.trim() !== '');
    return bulletPoints.map(point => `<p dir="ltr">${point.trim()}</p>`).join('\n');
  };

  return header + content.map(exp => 
    `<div style="display: flex; justify-content: space-between; align-items: center;">
      <strong>${exp.project_name}</strong>
      <span><strong>${exp.technologies_used.join(", ")} | ${exp.end_date}</strong></span>
    </div>
    ${formatDescription(exp.description)}`
  ).join('\n');
}

function generateSkills(programinglanguages: string[], technologies: string[]) {
  return `<p style="text-align: left;"><span style="color: ${accentColor};"><strong>Skills ______________________________________________________________________________________________________________</strong></span></p>
<p style="text-align: left;"><span style="color: #000000;"><strong>Languages:</strong> ${programinglanguages.join(", ")}</span></p>
<p style="text-align: left;"><span style="color: #000000;"><strong>Technologies:</strong> ${technologies.join(", ")}</span></p>`;
}

// Helper function to generate a random delay
function randomDelay(min: number = 1000, max: number = 1500) {
  return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));
}

// Main function to generate the resume string with random delay before each section
// Main function to generate the resume string with random delay before each section
export async function generateResume(
  sectionOrder: string[],
  blocks: Blocks,
  setLoadingState: (state: string) => void,
  editorRef: React.RefObject<TinyMCEEditor>
): Promise<void> {
  setLoadingState("Generating header...");

  // Generate and write the header first
  let resume = generateHeader(blocks.contact_information) + '\n\n';
  if (editorRef.current) {
    editorRef.current.setContent(resume);  // Write initial content (header)
  }

  for (const section of sectionOrder) {
    // Add a random delay between 500ms and 1000ms before generating each section
    await randomDelay();

    let sectionContent = "";

    switch (section.toLowerCase()) {
      case 'education':
        setLoadingState("Generating education section...");
        sectionContent = generateEducation(blocks.education) + '\n\n';
        break;
      case 'experience':
        setLoadingState("Generating experience section...");
        sectionContent = generateExperience(blocks.experience) + '\n\n';
        break;
      case 'projects':
        setLoadingState("Generating projects section...");
        sectionContent = generateProjects(blocks.projects.slice(0, 2)) + '\n\n';
        break;
      case 'skills':
        setLoadingState("Generating skills section...");
        sectionContent = generateSkills(blocks.programinglanguages, blocks.technologies) + '\n\n';
        break;
      case 'summary':
        setLoadingState("Generating summary...");
        sectionContent = blocks.professional_summary + '\n\n';
        break;
      default:
        setLoadingState("Unknown section found...");
        sectionContent = `Unknown section: ${section}` + '\n\n';
        break;
    }

    // Append the generated section content to the editor
    if (editorRef.current) {
      const currentContent = editorRef.current.getContent();  // Get existing content in the editor
      editorRef.current.setContent(currentContent + sectionContent);  // Append new section content
    }
  }

  setLoadingState(""); // Resume generation complete
}



// Function to fetch the blocks
export async function fetchBlocks(resume: string, jobDescription: string): Promise<Blocks> {
  try {
    const response = await fetch("http://localhost:8080/blocks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "job_description": jobDescription,
        "resume": resume,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling scraper API:", error);
    throw error;
  }
}
