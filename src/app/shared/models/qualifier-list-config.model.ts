export interface QualifierListConfig {
  type: string;

  filters: {
    tag?: string,
    author?: string,
    favorited?: string,
    limit?: number,
    offset?: number
  };
}
