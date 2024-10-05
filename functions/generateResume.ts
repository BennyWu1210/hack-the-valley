interface Block {
    section: string; // The section name, e.g., "Education", "Experience"
    content: any;    // The content, which varies depending on the section
  }

function generateEducation(content: any) {
    // Example content structure for Education
    return `Education: ${content.degree}, ${content.school} (${content.graduationYear})`;
  }
  
  function generateExperience(content: any) {
    // Example content structure for Experience
    return `Experience: ${content.title} at ${content.company} (${content.duration})\n${content.description}`;
  }
  
  function generateProjects(content: any[]) {
    // Example content structure for Projects
    let projectString = 'Projects:\n';
    content.forEach((project) => {
      projectString += ` - ${project.name} (Tech Stack: ${project.techStack.join(', ')})\n`;
    });
    return projectString;
  }
  
  function generateSkills(content: any[]) {
    // Example content structure for Skills
    return `Skills: ${content.join(', ')}`;
  }
  
  // Main function that generates the resume based on section order and blocks
  function generateResume(sectionOrder: string[], blocks: Block[]): string {
    let resume = '';
  
    sectionOrder.forEach((section) => {
      const block = blocks.find((b) => b.section === section);
  
      if (block) {
        switch (section) {
          case 'Education':
            resume += generateEducation(block.content) + '\n\n';
            break;
          case 'Experience':
            resume += generateExperience(block.content) + '\n\n';
            break;
          case 'Projects':
            resume += generateProjects(block.content) + '\n\n';
            break;
          case 'Skills':
            resume += generateSkills(block.content) + '\n\n';
            break;
          default:
            resume += `Unknown section: ${section}` + '\n\n';
            break;
        }
      }
    });
  
    return resume;
  }
  