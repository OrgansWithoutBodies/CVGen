import { writeFileSync } from "fs";
import { Education, Publication, WorkExperience } from "./types";

const skillLine = (skill: string, strength: number, ii: 0 | 1 | 2) =>
  `${skill} \\dotexp[${
    ii === 0 ? "First" : ii === 1 ? "Second" : "Third"
  }]{${strength}}\\\\`;

const jobLine = ({ info, place, role, timeframe }: WorkExperience) =>
  `\\CVItem{\\normalsize{${place} $\\cdot$ ${role}}}{${timeframe}}
\\CVDesc{${info}}`;
const schoolLine = ({ place, timeframe, description }: Education) =>
  `\\CVItem{\\normalsize{${place}}}{${timeframe}}
\\CVDesc{${description}}`;
// const presentationLine = ({
//   location,
//   pictureUrl,
//   pictureWidth,
//   title,
//   description: description,
// }: Presentation) =>
//   `\\CVItem{${title}}{${location}'\\includegraphics[width=${pictureWidth}\\linewidth]{${pictureUrl}}}
// \\CVDesc{${description}}`;
const publicationLine = ({ DOI, journal, issue, title }: Publication) =>
  `\\CVItem{\\normalsize{${title}}}{\\textit{${journal}} ${issue}. \\textbf{${DOI}}}`;

export const cvTemplate = ({
  humanLangsString,
  computerTechnologiesString,
  publicationsString,
  systemsExperienceString,
  otherSkillsString,
  jobstring,
  presentationString,
  educationString,
  colors,
  personalInfo: { name, email, github, linkedin, phone, personalWebsite },
}: {
  colors: [string, string, string];
  humanLangsString?: string;
  computerTechnologiesString?: string;
  systemsExperienceString?: string;
  otherSkillsString?: string;
  presentationString?: string;
  jobstring?: string;
  publicationsString?: string;
  educationString?: string;
  personalInfo: {
    name: string;
    email?: string;
    github?: string;
    linkedin?: string;
    phone?: string;
    personalWebsite?: string;
  };
}) => `%TODO
%implement smalldots
%automatic coloring for dots
%nicer font for headers
%modularize more - sections for Research/Work/Education get populated from other files, choose which to include?

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Document properties and packages
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\documentclass[a4paper,12pt,final]{memoir}

% misc
\\renewcommand{\\familydefault}{phv}	% font
\\pagestyle{empty}					% no pagenumbering
\\setlength{\\parindent}{0pt}			% no paragraph indentation


% required packages (add your own)
\\usepackage{flowfram}	% column layout
\\usepackage{changepage}
\\usepackage[top=10mm,left=5mm,right=3mm,bottom=5mm]{geometry}% margins
\\usepackage{graphicx}										% figures
\\usepackage{amsmath}
% \\usepackage{url}											% URLs\\textit{}
\\usepackage[usenames,dvipsnames]{xcolor}					% color
\\usepackage{multicol}	
% columns env.
	\\setlength{\\multicolsep}{0pt}
\\usepackage{wrapfig}
\\usepackage{paralist}										% compact lists
\\usepackage{tikz}
\\usepackage[sfdefault,thin,bold]{roboto}  %% Option 'sfdefault' only if the base font of the document is to be sans serif
\\usepackage{pgfplots}
\\usepackage[T1]{fontenc}
\\usepackage{tabu}
\\definecolor{Third}{HTML}{${colors[0]}}
\\definecolor{Second}{HTML}{${colors[1]}}
\\definecolor{First}{HTML}{${colors[2]}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Create column layout
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% define length commands
\\setlength{\\vcolumnsep}{\\baselineskip}
\\setlength{\\columnsep}{\\vcolumnsep}

% frame setup (flowfram package)
% left frame
\\newflowframe{0.2\\textwidth}{\\textheight}{0pt}{0pt}[left]
	\\newlength{\\LeftMainSep}
	\\setlength{\\LeftMainSep}{0.2\\textwidth}
	\\addtolength{\\LeftMainSep}{1\\columnsep}
 
% small static frame for the vertical line
\\newstaticframe{1.5pt}{\\textheight}{\\LeftMainSep}{0pt}
 
% content of the static frame

 
% right frame
\\addtolength{\\LeftMainSep}{1.5pt}
\\addtolength{\\LeftMainSep}{1\\columnsep}
\\newflowframe{0.75\\textwidth}{\\textheight}{\\LeftMainSep}{0pt}[main01]


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% define macros (for convience)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\newcommand{\\Sep}{\\vspace{1.5em}}
\\newcommand{\\SmallSep}{\\vspace{0.5em}}

\\newcommand{\\CVSection}[1]
	{\\vspace{-2pt}\\centering\\huge{\\bfseries{#1}}\\\\}
	
\\newcommand\\xsc{\\vspace{8pt}}

\\newcommand{\\CVItem}[2]
	{\\flushleft\\large\\textbf{\\color{black} #1}\\wavedot \\small{\\color{darkgray} \\mdseries{#2}}\\vspace{2pt}}
	
\\newcommand{\\CVDesc}[1]{\\begin{adjustwidth}{2mm}{}
\\textit{\\small{#1}}\\vspace{-5pt}
\\end{adjustwidth}}

\\newcommand{\\dotdiv}[1]{
    \\begin{staticcontents}{1}
    \\hfill 
    \\tikz{%
    	\\draw[dash pattern={on 5pt off 1pt on 4pt off 2pt on 3pt off 3pt on 2pt off 4pt on 1pt off 5pt},color=Black,line width=1.5pt,yshift=5]
    	({#1},-2) -- ({#1},\\textheight);}%
    	
    \\hfill\\mbox{}
\\end{staticcontents}
}

\\newcommand{\\udot}[1]{%
    \\tikz[baseline=(todotted.base)]{
        \\node[inner sep=5pt,outer sep=0pt] (todotted) {#1};
        \\draw[dash pattern={on 2pt off 10pt on 3 pt off 10 pt},line width=1.5pt] (todotted.south west) -- (todotted.south east);
        }
        }
        
        
\\newcommand{\\udotlist}[1]{

}
\\newcommand{\\wavedot}{
    \\begin{tikzpicture}[scale=.085,thick]
        \\begin{axis}[
          xmin=-2,
          xmax=2,
          ymin=-1,
          ymax=2,
          axis x line=none,
          axis y line=none, 
          samples = 120
        ]
    \\addplot[black] {exp(-x^2)*cos(deg(10*x))};
    \\end{axis}
    \\end{tikzpicture}
}
\\newcommand{\\dotexp}[2][cyan]{
\\tikz{\\foreach \\x in {1,...,#2}
    \\ifnum#2>0\\draw[black,fill=#1] (\\x/3,0) circle (.4ex)\\fi;
    \\ifnum#2<6
     \\foreach \\y in {#2,...,5}
     \\pgfmathparse{(\\y+1)/3}
     \\draw[darkgray,fill=white] (\\pgfmathresult,0) circle (.4 ex);
    \\fi
    }
}
 



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Begin document
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\begin{document}


% Left frame
%%%%%%%%%%%%%%%%%%%%
% \\begin{centering}
\\begin{figure}[h]
\\vspace{-20pt}
    \\centering
% 	\\includegraphics[width=.9\\columnwidth]{IMG_6117-FUZZ.pdf}
	\\begin{flushright}\\small
	\\textbf{${name}} \\\\
	\\vspace{-1.5pt}
  ${email === undefined ? "" : `\\textbf{${email}}`}
	\\\\
    ${github === undefined ? "" : `\\tiny{${github}}\\\\`}
    ${linkedin === undefined ? "" : `\\tiny{${linkedin}}\\\\`}
   	${phone === undefined ? "" : `\\textbf{${phone}}\\\\`}
   	${
      personalWebsite === undefined
        ? ""
        : `\\tiny{for more visit ${personalWebsite}}`
    }

\\end{flushright}
\\normalsize
\\end{figure}

\\dotdiv{0}

\\vspace{-4mm}
\\centering
${
  humanLangsString === undefined
    ? ""
    : `\\textbf{Human Langs}\\\\
\\vspace{-4mm}
\\begin{flushright}
${humanLangsString}
\\end{flushright}
`
}

${
  computerTechnologiesString === undefined
    ? ""
    : `\\textbf{Computer Langs}\\\\
\\vspace{-4mm}
\\begin{flushright}
${computerTechnologiesString}
\\end{flushright}`
}

${
  systemsExperienceString === undefined
    ? ""
    : `\\textbf{Technologies}\\\\
\\vspace{-4mm}
\\begin{flushright}
${systemsExperienceString}
\\end{flushright}`
}

${
  otherSkillsString === undefined
    ? ""
    : `\\textbf{Other Skills}\\\\
\\vspace{-4mm}
\\begin{flushright}
${otherSkillsString}    
\\end{flushright}`
}


\\vfill
\\framebreak


% Right frame
%%%%%%%%%%%%%%%%%%%%
% Education
\\xsc

 ${
   educationString === undefined
     ? ""
     : `\\CVSection{Education}\\vspace{-15pt}
${educationString}`
 }
${
  publicationsString === undefined
    ? ""
    : `\\CVSection{Published Papers}\\vspace{-15pt}
${publicationsString}`
}
${
  presentationString === undefined
    ? ""
    : `\\CVSection{Research Presentations}\\vspace{-15pt}
${presentationString}
`
}

${
  jobstring === undefined
    ? ""
    : `\\CVSection{Work Experience}
${jobstring}`
}
\\dotdiv{100}

\\vfill
% References
\\flushright\\hfill\\tiny{\\textit{References available upon request. All 3D visualizations I made to represent real data.
}}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% End document 
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\end{document}`;
const renderSkills = (dict: Record<string, number>): string =>
  Object.keys(dict)
    .sort((a, b) => {
      return a[0] > b[0] ? 1 : -1;
    })
    .sort((a, b) => {
      return dict[a] > dict[b] ? -1 : 1;
    })
    .map((key, ii) => {
      return skillLine(key, dict[key], (ii % 3) as 0 | 1 | 2);
    })
    .join("\n");
const renderWorkExperiences = (experiences: WorkExperience[]): string =>
  experiences
    .map((exp) => {
      return jobLine(exp);
    })
    .join("\n");
const renderEducation = (educations: Education[]): string =>
  educations
    .map((edu) => {
      return schoolLine(edu);
    })
    .join("\n");
const renderPublications = (pubs: Publication[]): string =>
  pubs
    .map((pub) => {
      return publicationLine(pub);
    })
    .join("\n");

// const renderResearchPresentation = (presentations: Presentation[]): string =>
//   presentations
//     .map((pres) => {
//       return presentationLine(pres);
//     })
//     .join("\n");
export function generateCV() {
  writeFileSync(
    "cv.tex",
    `%THIS LaTeX FILE IS GENERATED - ANY CHANGES WILL NOT BE SAVED AFTER REGENERATION
${cvTemplate({
  humanLangsString: renderSkills({ English: 6, Esperanto: 5, Klingon: 4 }),
  computerTechnologiesString: renderSkills({
    Python: 6,
    Anaconda: 5,
    // if skills need formatting, pass that in to the text here
    "\\text{\\tiny{Boa Constrictor}}": 4,
  }),
  systemsExperienceString: renderSkills({ Feeding: 4, Holding: 3, Coding: 1 }),
  otherSkillsString: "",
  // work & education are ordered arrays bc theyre expected to be rendered in order given
  colors: ["ff0000", "00ff00", "0000ff"],
  personalInfo: {
    name: "John Doe",
    email: "email@gmail.com",
    github: "github.com/github",
    linkedin: "linkedin.com/in/link-zelda-1234",
    phone: "+1 (123) 456-7890",
    personalWebsite: "www.internet.com",
  },
  jobstring: renderWorkExperiences([
    {
      place: "Jobsite",
      role: "Jobber",
      timeframe: "yesterday - today",
      info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
  ]),
  publicationsString: renderPublications([
    {
      DOI: "DOI:1234",
      issue: "none whats yours",
      journal: "hard knocks quarterly review",
      title: "ha? a retrospective.",
    },
  ]),
  educationString: renderEducation([
    {
      place: "School of Rock",
      description: "PHD in rock, BA in roll",
      timeframe: "since the worlds been turning",
    },
  ]),
  // if nothing is provided for a section, its not rendered
  // presentationString: renderResearchPresentation([]),
})}`
  );
}
