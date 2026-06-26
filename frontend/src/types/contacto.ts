export interface ContactInfo {
  id?: string;
  nombre: string;
  fotoUrl: string;
  instagram: string | null;
  facebook: string | null;
  whatsapp: string | null;
  tiktok: string | null;
  twitter: string | null;
  gmail: string | null;
  youtube: string | null;
}

export type ContactInfoUpdate = Omit<ContactInfo, "id">;
