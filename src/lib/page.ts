export function getErrorMessage(err: unknown): string {
  if (!err) return "";
  if (typeof err === "string") return err;
  if (err instanceof Error) return `${err.message}`;
  try {
    return JSON.stringify(err, null, 2);
  } catch {
    return String(err);
  }
}

export function dataCoverageHint(coverageFrom: string, coverageTo: string, isFetched: boolean, hasData: boolean): string {
  let coverageHint = "Not Searched";
  if (!isFetched) return coverageHint;
  
  if (!hasData) coverageHint = "No Data";
  if (coverageFrom !== "" && coverageTo !== "") {
    coverageHint = `${coverageFrom.split("T")[0]} ~ ${coverageTo.split("T")[0]}`;
  }

  return coverageHint;
}