export const QueryKey = {
  AUTH: "auth",
  USER_LIST: "user-list",
} as const;

export type QueryKey = (typeof QueryKey)[keyof typeof QueryKey];
