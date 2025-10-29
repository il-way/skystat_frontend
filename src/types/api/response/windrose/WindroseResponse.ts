export type WindroseResponse = {
  coverageFrom: string;
  coverageTo: string;
  totalCount: number;
  variableSize: number;
  sampleSize: number;
  speedBins: string[]; // ["CALM","1-5KT","5-10KT",...]
  directionBins: string[]; // ["N","NNE","NE",...,"NNW"]
  data: Array<{
    month: number; // 1~12
    sbIndex: number; // speedBins index
    dbIndex: number; // directionBins index
    frequency: number; // raw count
    rate: number; // percentage (e.g. 3.12)
  }>;
};
