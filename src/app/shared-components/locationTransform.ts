// import countryData from './countrystate.json';
import countryData from "./countryJson.json";
import stateData from "./stateJson.json";
import axios from "axios";

interface Country {
  iso2: any;
  name: string;
  emoji: string;
}

const countryDatas: any = countryData;

// interface State {
//   name: string;
//   // Add any other properties you might need
// }

// interface City {
//   name: string;
//   // Add any other properties you might need
// }

export const getAllCountry = (): Country[] => {
  return countryDatas?.map((country: any) => ({
    country_id: country?.id,
    name: country?.name,
    emoji: country?.emoji,
    iso2: country?.iso2,
  }));
};

export const getAllStateByCountry = (countryName: string) => {
  const allState = stateData?.filter(
    (state: any) => state?.country_name === countryName
  );
  return allState?.length > 0 ? allState : [];
};

// export const getAllStateByCountry = (countryName: string): string[] => {
//   const country = countryDatas.find((country: any) => country.name === countryName);
//   return country ? country.states.map((state: any) => state.name) : [];
// };

export const getAllCityByState = async (
  countryName: string,
  stateName: string
) => {
  const getCity = await axios.get(
    `https://api-dev.mlawatches.com/api/customer/auth/cities?country_name=${countryName}&state_name=${stateName}`
  );
  return getCity?.data?.results?.length > 0 ? getCity?.data?.results : [];
};

// export const getAllCityByState = (countryName: string, stateName: string): string[] => {
//   const country = countryDatas.find((country: any) => country.name === countryName);
//   if (country) {
//     const state = country.states.find((state: any) => state.name === stateName);
//     return state ? state.cities.map((city: any) => city.name) : [];
//   }
//   return [];
// };

export const getAllModelByBrand = (BrandName: string, ModelDatas): string[] => {
  const Brand = ModelDatas.find((Brand: any) => Brand.name === BrandName);
  return Brand ? Brand.states.map((state: any) => state.name) : [];
};
