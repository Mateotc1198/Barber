import { ServicioData } from "../../../domain/entities/Servicio";

export const TRATAMIENTOS: ServicioData[] = [
  {
    name: "Tratamiento Capilar",
    description: "Diagnóstico del estado del cabello y cuero cabelludo con aplicación de mascarilla reparadora de keratina vegetal. Devuelve brillo, suavidad y resistencia al cabello dañado.",
    price: 25000,
    category: "Tratamientos",
    imageUrls: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80&auto=format&fit=crop"],
    cupos: 5,
    duracionMinutos: 35,
  },
  {
    name: "Masaje de Cuero Cabelludo",
    description: "Masaje profundo con aceites esenciales para estimular la circulación, reducir el estrés y fortalecer los folículos pilosos. Alivia la tensión craneal y mejora el descanso.",
    price: 15000,
    category: "Tratamientos",
    imageUrls: ["https://images.unsplash.com/photo-1499887142886-791eca5918cd?w=800&q=80&auto=format&fit=crop"],
    cupos: 8,
    duracionMinutos: 20,
  },
  {
    name: "Hidratación Profunda",
    description: "Mascarilla hidratante premium con ácido hialurónico y proteínas de seda bajo calor. Reconstruye la fibra capilar, elimina el frizz y sella las puntas abiertas.",
    price: 30000,
    category: "Tratamientos",
    imageUrls: ["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80&auto=format&fit=crop"],
    cupos: 4,
    duracionMinutos: 45,
  },
  {
    name: "Keratina / Alisado Japonés",
    description: "Tratamiento de alisado progresivo con keratina profesional. Elimina el frizz, define la forma natural del cabello y facilita el peinado diario. Dura hasta 4 meses.",
    price: 50000,
    category: "Tratamientos",
    imageUrls: ["https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800&q=80&auto=format&fit=crop"],
    cupos: 3,
    duracionMinutos: 90,
    customOptions: [
      { name: "Tipo", values: ["Keratina express", "Keratina clásica", "Alisado japonés"] },
    ],
  },
  {
    name: "Nutrición Capilar",
    description: "Protocolo de nutrición intensiva con ampolletas de proteínas, vitaminas y aceites esenciales. Ideal para cabellos secos, con quiebre o debilitados por procesos químicos.",
    price: 22000,
    category: "Tratamientos",
    imageUrls: ["https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800&q=80&auto=format&fit=crop"],
    cupos: 6,
    duracionMinutos: 30,
  },
];
