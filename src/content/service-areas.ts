import type { CityLabel } from "@/domain/types";

export type ServiceAreaGroup = {
  label: string;
  areas: string[];
};

/**
 * Major local government areas and pickup districts served in each city.
 * Exact coverage for any request is confirmed by the Olasco team — these
 * lists are a picker aid, not a coverage guarantee.
 */
export const lagosServiceAreas: ServiceAreaGroup[] = [
  {
    label: "Lagos Mainland",
    areas: ["Agege", "Ifako-Ijaiye", "Ikeja", "Kosofe", "Lagos Mainland", "Mushin", "Oshodi-Isolo", "Shomolu", "Surulere"],
  },
  {
    label: "Lagos Island & Lekki",
    areas: ["Eti-Osa", "Ibeju-Lekki", "Lagos Island"],
  },
  {
    label: "Greater Lagos",
    areas: ["Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Ojo"],
  },
  {
    label: "Lagos East & West",
    areas: ["Badagry", "Epe", "Ikorodu"],
  },
];

export const abujaServiceAreas: ServiceAreaGroup[] = [
  {
    label: "Area Councils",
    areas: ["Abaji", "Abuja Municipal (AMAC)", "Bwari", "Gwagwalada", "Kuje", "Kwali"],
  },
  {
    label: "Major Districts",
    areas: [
      "Asokoro",
      "Central Business District",
      "Galadimawa",
      "Garki",
      "Gwarinpa",
      "Jabi",
      "Jahi",
      "Katampe",
      "Kubwa",
      "Karu",
      "Life Camp",
      "Lokogoma",
      "Lugbe",
      "Mabushi",
      "Maitama",
      "Mpape",
      "Nyanya",
      "Utako",
      "Wuse",
      "Wuye",
    ],
  },
];

export const serviceAreaGroups: Record<CityLabel, ServiceAreaGroup[]> = {
  Lagos: lagosServiceAreas,
  Abuja: abujaServiceAreas,
};

export const serviceAreaLabels: Record<CityLabel, { field: string; helper: string; placeholder: string }> = {
  Lagos: {
    field: "Local government area",
    helper: "Pick the LGA where the journey starts. Coverage is confirmed per request.",
    placeholder: "Choose a local government area",
  },
  Abuja: {
    field: "Area council / district",
    helper: "Pick the area council or district where the journey starts. Coverage is confirmed per request.",
    placeholder: "Choose an area council or district",
  },
};

export function isServiceAreaOf(city: CityLabel, area: string) {
  const normalized = area.trim().toLowerCase();
  return serviceAreaGroups[city].some((group) => group.areas.some((entry) => entry.toLowerCase() === normalized));
}

export function serviceAreasForCity(city: CityLabel): string[] {
  return serviceAreaGroups[city].flatMap((group) => group.areas);
}

/** Flat list of every known area, used for storage-side sanity checks. */
export const allServiceAreas = serviceAreasForCity("Lagos").concat(serviceAreasForCity("Abuja"));
