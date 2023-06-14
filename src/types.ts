// type SkillPhrase=
export type WorkExperience = {
  place: string;
  role: string;
  timeframe: string;
  info: string;
};
export type Education = {
  place: string;
  timeframe: string;
  description: string;
};
export type Presentation = {
  title: string;
  location: string;
  pictureWidth: number;
  description: string;
  pictureUrl: string;
};
export type Publication = {
  DOI: `DOI:${string}`;
  issue: string;
  journal: string;
  title: string;
};
