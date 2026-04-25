import axios from "axios";

export interface CountryStat {
  country: string;
  count: number;
}

export interface GenreStat {
  name: string;
  value: number;
}

async function getCountryStats() {
  const response = await axios.get("/api/analysis/country");
  return response.data;
}

async function getGenreStats() {
  const response = await axios.get("/api/analysis/genre");
  return response.data;
}

export { getCountryStats, getGenreStats };