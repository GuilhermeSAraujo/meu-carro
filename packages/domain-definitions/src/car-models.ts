export type CarModel = {
  model: string;
  years: string;
};

export type CarModelsData = {
  [brand: string]: CarModel[];
};

export const CAR_MODELS_DATA: CarModelsData = {
  Fiat: [
    { model: "Uno", years: "2000~2014" },
    { model: "Palio", years: "2000~2017" },
    { model: "Strada", years: "2001~2024" },
    { model: "Siena", years: "2000~2017" },
    { model: "Punto", years: "2007~2017" },
    { model: "Argo", years: "2017~2024" },
    { model: "Toro", years: "2016~2024" },
    { model: "Fiorino", years: "2001~2024" },
  ],
  Volkswagen: [
    { model: "Gol", years: "2000~2023" },
    { model: "Fox", years: "2003~2019" },
    { model: "Polo", years: "2002~2024" },
    { model: "Voyage", years: "2008~2024" },
    { model: "Golf", years: "2000~2022" },
    { model: "Saveiro", years: "2000~2024" },
    { model: "T-Cross", years: "2019~2024" },
    { model: "Nivus", years: "2020~2024" },
    { model: "Up", years: "2014~2022" },
  ],
  Chevrolet: [
    { model: "Onix", years: "2012~2024" },
    { model: "Celta", years: "2000~2015" },
    { model: "Prisma", years: "2006~2019" },
    { model: "Corsa", years: "2000~2012" },
    { model: "S10", years: "2000~2024" },
    { model: "Montana", years: "2003~2010" },
  ],
  Hyundai: [
    { model: "HB20", years: "2012~2024" },
    { model: "HB20S", years: "2013~2024" },
    { model: "Tucson", years: "2005~2024" },
    { model: "Santa Fe", years: "2001~2024" },
    { model: "Creta", years: "2016~2024" },
  ],
  Toyota: [
    { model: "Corolla", years: "2000~2024" },
    { model: "Hilux", years: "2000~2024" },
    { model: "Etios", years: "2012~2021" },
    { model: "Yaris", years: "2018~2024" },
    { model: "Corolla Cross", years: "2020~2024" },
  ],
  Renault: [
    { model: "Clio", years: "2000~2012" },
    { model: "Sandero", years: "2007~2024" },
    { model: "Logan", years: "2007~2024" },
    { model: "Duster", years: "2011~2024" },
    { model: "Megane", years: "2000~2011" },
  ],
  Jeep: [
    { model: "Renegade", years: "2015~2024" },
    { model: "Compass", years: "2017~2024" },
    { model: "Grand Cherokee", years: "2000~2024" },
  ],
  Honda: [
    { model: "Civic", years: "2000~2024" },
    { model: "Fit (Jazz)", years: "2003~2021" },
    { model: "HR-V", years: "2015~2024" },
    { model: "City", years: "2009~2024" },
  ],
  Nissan: [
    { model: "Kicks", years: "2016~2024" },
    { model: "Sentra", years: "2000~2020" },
    { model: "March", years: "2010~2019" },
    { model: "Versa", years: "2012~2024" },
    { model: "Frontier", years: "2000~2024" },
  ],
  BYD: [
    { model: "Yuan / Yuan Plus", years: "2023~2024" },
    { model: "Atto 3", years: "2023~2024" },
    { model: "Song / Tang (importados/selecionados)", years: "2023~2024" },
  ],
  Ford: [
    { model: "Fiesta", years: "2000~2014" },
    { model: "Ka", years: "2000~2021" },
    { model: "EcoSport", years: "2003~2021" },
    { model: "Focus", years: "2000~2019" },
  ],
  Citroen: [
    { model: "C3", years: "2003~2024" },
    { model: "C4 Picasso / Grand C4", years: "2006~2020" },
    { model: "Aircross", years: "2010~2016" },
  ],
};

export const CAR_BRANDS = Object.keys(CAR_MODELS_DATA);

export const getCarModels = (brand: string): string[] => {
  if (!brand) return [];
  return CAR_MODELS_DATA[brand]?.map((item) => item.model) || [];
};
