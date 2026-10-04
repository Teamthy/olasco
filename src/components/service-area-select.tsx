"use client";

import { serviceAreaGroups, serviceAreaLabels } from "@/content/service-areas";
import { FieldError } from "@/components/ui";

export type ServiceAreaCity = "Lagos" | "Abuja" | "";

const emptyGroups: typeof serviceAreaGroups.Lagos = [];

/**
 * Dependent city → local government area / district dropdown pair.
 * The area list is rebuilt whenever the city changes and the previous
 * area choice is cleared so a Lagos LGA can never be sent for Abuja.
 */
export function ServiceAreaSelect({
  city,
  onCityChange,
  area,
  onAreaChange,
  cityId = "service-city",
  areaId = "service-area",
  cityLabel = "City",
  cityOptional = false,
  areaOptional = true,
  error,
}: {
  city: ServiceAreaCity;
  onCityChange: (city: ServiceAreaCity) => void;
  area: string;
  onAreaChange: (area: string) => void;
  cityId?: string;
  areaId?: string;
  cityLabel?: string;
  cityOptional?: boolean;
  areaOptional?: boolean;
  error?: string;
}) {
  const hasCity = city === "Lagos" || city === "Abuja";
  const groups = hasCity ? serviceAreaGroups[city] : emptyGroups;
  const labels = hasCity ? serviceAreaLabels[city] : serviceAreaLabels.Lagos;
  const optionCount = hasCity ? groups.reduce((total, group) => total + group.areas.length, 0) : 0;

  function changeCity(next: ServiceAreaCity) {
    onCityChange(next);
    if (area) onAreaChange("");
  }

  return (
    <>
      <div className="form-field">
        <label htmlFor={cityId}>
          {cityLabel} {cityOptional ? <span className="optional">Optional</span> : null}
        </label>
        <select
          id={cityId}
          value={city}
          onChange={(event) => changeCity(event.target.value as ServiceAreaCity)}
          aria-describedby={cityOptional ? `${cityId}-help` : undefined}
        >
          {cityOptional ? <option value="">No preference</option> : null}
          <option value="Lagos">Lagos</option>
          <option value="Abuja">Abuja</option>
        </select>
        {cityOptional ? (
          <p id={`${cityId}-help`} className="form-help">
            Choose a city to list its local government areas and districts.
          </p>
        ) : null}
      </div>
      <div className="form-field">
        <label htmlFor={areaId}>
          {hasCity ? labels.field : "Area / LGA"} {areaOptional ? <span className="optional">Optional</span> : null}
        </label>
        <select
          id={areaId}
          value={area}
          disabled={!hasCity}
          onChange={(event) => onAreaChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${areaId}-error` : `${areaId}-help`}
        >
          <option value="">{hasCity ? labels.placeholder : "Choose a city first"}</option>
          {groups.map((group) => (
            <optgroup label={group.label} key={group.label}>
              {group.areas.map((entry) => (
                <option value={entry} key={entry}>
                  {entry}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {error ? (
          <FieldError id={`${areaId}-error`}>{error}</FieldError>
        ) : (
          <p id={`${areaId}-help`} className="form-help">
            {hasCity ? labels.helper : "Pick the city first, then the local government area or district."}{" "}
            {hasCity ? `${optionCount} areas listed.` : ""}
          </p>
        )}
      </div>
    </>
  );
}
