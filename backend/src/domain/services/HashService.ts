export interface HashService {
  compare(plainText: string, hash: string): Promise<boolean>;
  generate(plainText: string): Promise<string>;
}
