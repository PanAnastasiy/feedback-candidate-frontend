export type FeedbackField = {
  skill_id: number;
  level: number;
  comment: string;
};

export interface SkillRating {
  skill: string;
  level: number;
}