export interface CodigoPais {
  codigo: string;
  nombre: string;
}

export const CODIGOS_PAIS: CodigoPais[] = [
  { codigo: "57", nombre: "Colombia (+57)" },
  { codigo: "52", nombre: "México (+52)" },
  { codigo: "51", nombre: "Perú (+51)" },
  { codigo: "56", nombre: "Chile (+56)" },
  { codigo: "54", nombre: "Argentina (+54)" },
  { codigo: "593", nombre: "Ecuador (+593)" },
  { codigo: "58", nombre: "Venezuela (+58)" },
  { codigo: "507", nombre: "Panamá (+507)" },
  { codigo: "506", nombre: "Costa Rica (+506)" },
  { codigo: "34", nombre: "España (+34)" },
  { codigo: "1", nombre: "EE.UU. / Canadá (+1)" },
];

export const CODIGO_PAIS_DEFECTO = "57";
