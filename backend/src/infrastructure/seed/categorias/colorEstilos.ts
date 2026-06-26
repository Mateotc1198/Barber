import { ServicioData } from "../../../domain/entities/Servicio";

export const COLOR_ESTILOS: ServicioData[] = [
  {
    name: "Decoloración Total",
    description: "Proceso de decoloración completa del cabello con productos de alta calidad. Ideal para llegar a tonos platino, gris o preparar el cabello para colores de fantasía. Incluye tratamiento post-decoloración.",
    price: 70000,
    category: "Color & Estilos",
    imageUrls: ["https://images.unsplash.com/photo-1579762593175-20226054cad0?w=800&q=80&auto=format&fit=crop"],
    cupos: 2,
    duracionMinutos: 120,
    customOptions: [
      { name: "Nivel objetivo", values: ["Rubio oscuro", "Rubio claro", "Platino", "Ultra blanco"] },
    ],
  },
  {
    name: "Mechas / Highlights",
    description: "Aplicación de mechas o highlights para agregar dimensión y profundidad al cabello. Técnicas balayage, babylights o mechas clásicas para un resultado luminoso y moderno.",
    price: 60000,
    category: "Color & Estilos",
    imageUrls: ["https://images.unsplash.com/photo-1624948465027-6f9b51067557?w=800&q=80&auto=format&fit=crop"],
    cupos: 2,
    duracionMinutos: 100,
    customOptions: [
      { name: "Técnica", values: ["Balayage", "Babylights", "Mechas clásicas", "Ombré"] },
    ],
  },
  {
    name: "Trenzas / Cornrows",
    description: "Trenzas africanas, cornrows, box braids o trenzas con extensiones. Estilo urbano de alto impacto visual con larga duración. Se adapta a todo tipo y longitud de cabello.",
    price: 35000,
    category: "Color & Estilos",
    imageUrls: ["https://images.unsplash.com/photo-1534337621606-e3df5ee0e97f?w=800&q=80&auto=format&fit=crop"],
    cupos: 3,
    duracionMinutos: 90,
    customOptions: [
      { name: "Tipo de trenza", values: ["Cornrows clásicas", "Box braids", "Trenzas con extensiones", "Freestyle"] },
    ],
  },
  {
    name: "Coloración Completa",
    description: "Cambio de color total con tinte profesional libre de amoniaco. Incluye diagnóstico previo, preparación del cabello, aplicación, lavado con productos neutros y peinado final.",
    price: 50000,
    category: "Color & Estilos",
    imageUrls: ["https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=800&q=80&auto=format&fit=crop"],
    cupos: 3,
    duracionMinutos: 80,
    customOptions: [
      { name: "Gama de color", values: ["Tonos naturales", "Cobrizos / Rojizos", "Rubios", "Oscuros"] },
    ],
  },
  {
    name: "Tinte de Fantasía",
    description: "Coloración en tonos no convencionales: azul, verde, rojo, rosa, morado, naranja y más. Semipermanente de alta intensidad. Requiere base decolorada para máxima saturación.",
    price: 65000,
    category: "Color & Estilos",
    imageUrls: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80&auto=format&fit=crop"],
    cupos: 2,
    duracionMinutos: 90,
    customOptions: [
      { name: "Color", values: ["Azul", "Verde", "Rojo intenso", "Rosa", "Morado", "Naranja", "Multicolor"] },
    ],
  },
];
