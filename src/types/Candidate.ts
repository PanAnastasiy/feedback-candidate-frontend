
export interface Candidate {
  id: number;
  fullname: string;
  email: string;
  position: string;
  created_at: string; // ISO timestamp
  status: string | null;
}

export interface CandidateCreate {
  fullname: string;
  email: string;
  position: string;
  status?: string;
}

export interface CandidateUpdate {
  fullname?: string;
  email?: string;
  position?: string;
  status?: string;
}
