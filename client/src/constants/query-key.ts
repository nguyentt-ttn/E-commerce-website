export const QueryKey = {
  AUTH: "auth",
} as const;

export type QueryKey = (typeof QueryKey)[keyof typeof QueryKey];
