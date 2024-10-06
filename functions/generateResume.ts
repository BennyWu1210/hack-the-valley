const accentColor = '#169179';

function generateHeader(content: { email: string; github: string; linkedin: string; name: string; website: string; }) {
  return `<h1 style="text-align: center;">${content.name}</h1><p style="text-align: center;"><strong><span style="text-decoration: underline; color: ${accentColor};">${content.email}</span></strong> |<span style="color: ${accentColor};"> </span><strong><span style="text-decoration: underline; color: ${accentColor};">${content.website}</span></strong> | <strong><span style="text-decoration: underline; color: ${accentColor};">${content.github}</span></strong> |<strong><span style="text-decoration: underline; color: ${accentColor};"> ${content.linkedin}</span></strong></p>`;
}


function generateEducation(content: any[]) {
  const education = content[0];
  const header = `<p style="text-align: left;"><span style="color: ${accentColor};"><strong>Education _________________________________________________________________________________________________________</strong></span></p>`;

  return header + `<div style="display: flex; justify-content: space-between; align-items: center;">
    <strong>${education.institution}</strong>
    <span><strong>${education.degree} &middot; ${education.starting_year} &ndash; ${education.graduation_year}</strong></span>
  </div>
  <p>${education.description}</p>`;
}


function generateExperience(content: any[]) {
  // Example content structure for Experience
  const header = `<p style="text-align: left;"><span style="color: ${accentColor};"><strong>Experience ________________________________________________________________________________________________________</strong></span></p>`;

  const formatDescription = (description: string) => {
    // Split the description by periods or bullet points (you can adjust the regex if needed)
    const bulletPoints = description.split(/(?: - |•|\n)/).filter(point => point.trim() !== '');

    // Wrap each bullet point in the required HTML tags
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

interface Project {
  project_name: string;
  technologies_used: string[];
  end_date: string;
  description: string;
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

function generateSkills(programinglanguages: any[], technologies: any[]) {
  return `<p style="text-align: left;"><span style="color: ${accentColor};"><strong>Skills ______________________________________________________________________________________________________________</strong></span></p>
<p style="text-align: left;"><span style="color: #000000;"><strong>Languages:</strong> ${programinglanguages.join(", ")}</span></p>
<p style="text-align: left;"><span style="color: #000000;"><strong>Technologies:</strong> ${technologies.join(", ")}</span></p>`;
}

// Main function that generates the resume based on section order and blocks
export function generateResume(sectionOrder: string[]): string {
  let resume = '';

  // This is the block structure from your schema
  const blocks = {
    "contact_information": {
        "email": "riri.hong@gmail.com",
        "github": "github.com/Ri-Hong",
        "linkedin": "linkedin.com/in/ririhong",
        "name": "Ri Hong",
        "website": "rihong.ca"
    },
    "education": [
        {
            "degree": "Bachelors of Computer Science (Co-op)",
            "description": "- <strong>84% Average</strong>",
            "graduation_year": "2027",
            "institution": "University of Waterloo",
            "starting_year": "2022"
        }
    ],
    "experience": [
        {
            "company": "Trend Micro",
            "description": "- <strong>Upgraded the legacy Deep Security Manager from JDK 8 to JDK 11</strong>, modernizing the codebase and enhancing compatibility for over 250 million global customers\n- <strong>Led the first JDK upgrade in the product's 10-year history</strong>, ensuring competitiveness and security\n- <strong>Retooled the Jenkins CI/CD pipeline for JDK 11</strong>, boosting automation and streamlining deployment\n- <strong>Upgraded key development tools for seamless JDK 11 integration</strong>",
            "end_date": "Summer 2024",
            "job_title": "Software Developer Intern",
            "location": "Ottawa, ON",
            "start_date": "Summer 2024"
        },
        {
            "company": "GeeseHacks",
            "description": "- <strong>Led a team of 7 developers to create software infrastructure for a first-time hackathon</strong> with over 600+ attendees, securing $12k in funding\n- Guided project direction, pioneering the concept of project-based teams to <strong>improve enthusiasm and productivity by 32%</strong>\n- <strong>Pioneered use of Github Actions pipeline</strong>, increasing developer productivity by 43%\n- Promoted a culture of <strong>quality and testing by integrating Jest for unit tests and Cypress for E2E testing</strong>",
            "end_date": "Present",
            "job_title": "Lead Software Developer",
            "location": "Waterloo, ON",
            "start_date": "May 2024"
        },
        {
            "company": "Microgreen Solar Corp",
            "description": "- <strong>Spearheaded and meticulously documented a full-stack AWS Cloud project</strong> for processing EnergyPak lithium battery data\n- Utilized AWS services including API Gateway, Lambda, DynamoDB, IoT Core, and Amplify\n- <strong>Implemented a PWA frontend with Next.js</strong>, optimizing navigation with SSR\n- Dramatically reduced data retrieval latency and operational costs by 318% through effective use of browser indexedDB caching",
            "end_date": "Fall 2023",
            "job_title": "Software Developer Intern",
            "location": "Toronto, ON",
            "start_date": "Fall 2023"
        }
    ],
    "professional_summary": "Innovative software developer with extensive internships and leadership experience. Skilled in full-stack development, automation, and enhancing developer productivity through advanced CI/CD pipelines. Proven success in hackathons with award-winning projects.",
    "programinglanguages": [
        "Python",
        "C/C++",
        "TypeScript",
        "JavaScript",
        "Java",
        "HTML",
        "CSS"
    ],
    "projects": [
        {
            "description": "- <strong>Created a CLI tool to solve the last-mile-delivery problem</strong>, enabling volunteers to deliver pizza directly to hackers\n- Used Mappedin for room labeling and path finding, Terraform to automate pizza orders\n- <strong>Awarded Best Use of Terraform at Hack the North 2024, Canada’s largest hackathon</strong>",
            "end_date": "Sept 2024",
            "project_name": "Skip the Walk",
            "start_date": "Sept 2024",
            "technologies_used": [
                "Terraform",
                "Mappedin",
                "Commander.js",
                "Slack API"
            ]
        },
        {
            "description": "- <strong>Led the development of a mobile app to streamline prescription conversion and communication</strong> between physicians, pharmacists, and patients\n- Integrated Google Cloud Vision OCR and Gemini Pro for accurate text extraction\n- <strong>Won MedX AI Challenge and placed Top 10 at DeltaHacks X</strong>",
            "end_date": "Jan 2024",
            "project_name": "PharmFill",
            "start_date": "Jan 2024",
            "technologies_used": [
                "Google Cloud Vision",
                "Gemini",
                "Python Pillow"
            ]
        },
        {
            "description": "- Developed an AI assistant to simplify blockchain tasks like minting NFTs and smart contract audits\n- Implemented the T3 stack for a full-stack web demo, using IPFS/Filecoin and The Graph\n- <strong>Won Worldcoin Best AI Use Case and Pool Prizes from UMA and The Graph</strong>",
            "end_date": "June 2023",
            "project_name": "Blockmind AI",
            "start_date": "June 2023",
            "technologies_used": [
                "GPT-4",
                "Polygon",
                "LangChain",
                "Faiss"
            ]
        },
        {
            "description": "- Engineered an AI study assistant using GPT-4 for personalized learning tools\n- Led the RAG process architecture, integrating GPT-4 with MongoDB Vector Search\n- Achieved <strong>4th place at Hack the Valley 8</strong>",
            "end_date": "Oct 2023",
            "project_name": "FlaimBrain",
            "start_date": "Oct 2023",
            "technologies_used": [
                "LangChain",
                "GPT-4",
                "MongoDB",
                "Flask"
            ]
        }
    ],
    "technologies": [
        "React.js",
        "Next.js",
        "AWS",
        "Git",
        "SQL",
        "Github Actions",
        "Linux",
        "Prisma",
        "Jenkins",
        "Docker",
        "Flask",
        "Swagger"
    ]
};

  resume += generateHeader(blocks.contact_information) + '\n\n';

  // Loop through sectionOrder and generate the appropriate content
  sectionOrder.forEach((section) => {
    switch (section.toLowerCase()) {
      case 'education':
        resume += generateEducation(blocks.education) + '\n\n';
        break;
      case 'experience':
        resume += generateExperience(blocks.experience) + '\n\n';
        break;
      case 'projects':
        resume += generateProjects(blocks.projects.slice(0, 2)) + '\n\n';
        break;
      case 'skills':
        resume += generateSkills(blocks.programinglanguages, blocks.technologies) + '\n\n';
        break;
      case 'summary':
        resume += blocks.professional_summary + '\n\n';
        break;
      default:
        resume += `Unknown section: ${section}` + '\n\n';
        break;
    }
  });

  return resume;
}
