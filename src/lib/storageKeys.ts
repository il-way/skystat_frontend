export const APP = "skystat";
export const AREA = "scope";
export const VER = "v1";

export function ssKey(pageId: string) {
  return`${APP}:${AREA}:${VER}:${pageId}`;
}