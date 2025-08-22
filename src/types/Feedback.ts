import {Skill} from "./Skill";

export interface FeedbackItem {
  section_id: number;
  skill_id: number;
  level?: number;
  comment?: string;
}

export interface SectionWithKeywords {
  section_id: number;
  section_name: string;
  keywords: string;
}

export interface Feedback {
  id: number;
  candidate_fullname: string;
  final_feedback: string | null;
  sections: {
    id: number;
    name: string;
    skills: Skill[];
  }[];
}
