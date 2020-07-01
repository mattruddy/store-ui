import React, { memo } from "react"
import { FormItem } from "../.."
import { CountryDropdown, RegionDropdown } from "react-country-region-selector"
import "./styles.css"

interface ContainerProps {
  country: string
  region: string
  onCountryChange: (val: string) => void
  onRegionChange: (val: string) => void
}

const LocationSelect: React.FC<ContainerProps> = ({
  country,
  region,
  onCountryChange,
  onRegionChange,
}) => {
  return (
    <FormItem name="Location">
      <div style={{ width: "100%" }}>
        <div className="LocationSelectCountry">
          <CountryDropdown value={country} onChange={onCountryChange} />
        </div>
        {country && (
          <div className="LocationSelectRegion">
            <RegionDropdown
              country={country}
              value={region}
              onChange={onRegionChange}
            />
          </div>
        )}
      </div>
    </FormItem>
  )
}

export default memo(LocationSelect)
