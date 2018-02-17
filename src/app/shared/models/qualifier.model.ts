export interface QualifierR {
  systemQualifiers: Qualifier[],
  qualifierSummary: Summary
}

export interface Qualifier {
  id: number;
  automatedBetTransactionId: number;
  status: string;
  importedDate: Date;
  mode: string;
  systemId: number;
  system: string;
  subSystemId: number;
  subSystem: string;
  date: Date;
  course: string;
  time: string;
  horse: string;
  notes: string;
  stake: number;
  maxBFSP: number;
  ptsBet: number;
  win: number;
  place: number;
  winBsp: number;
  placeBsp: number;
  ptsReturned: number;
  automatedBet: AutomatedBet;
}

export interface AutomatedBet {
  id: number;
  automatedBetTransactionId: number;
  status: string;
  placedDate: Date;
  FailureReason: string;
}

export interface Summary {
  selections: number;
  wins: number;
  strikeRate: number;
  return: number;
  profit: number;
}
