import React, { useState } from 'react';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';

export default function TemplateDemo({ data, setStaff }: any) {
  const [selectedCountries, setSelectedCountries] = useState<any[] | null>(
    null,
  );
  const [staff, setStaticStaff] = useState<string[]>([]);
  const removeCountry = (countryToRemove: any, staffId: string) => {
    setSelectedCountries(
      selectedCountries?.filter(
        (country) => country.name !== countryToRemove.name,
      ) || null,
    );
    setStaff(staff?.filter((id) => id != staffId) || null);
  };
  const countryTemplate = (option: any) => {
    return (
      <div className="d-d-flex align-items-center">
        {option?.image != '' ? (
          <ImageWithoutBasePath
            // alt={option.name}
            src={option?.image}
            className="tag-avatar w-14 rounded me-1"
            style={{ width: '14px !important ' }}
          />
        ) : (
          <ImageWithBasePath
            // alt={option.name}
            src="assets/img/profiles/avatar-05.jpg"
            className="tag-avatar w-14 rounded me-1"
            style={{ width: '14px !important ' }}
          />
        )}
        <span>{option.name}</span>
      </div>
    );
  };

  const selectedCountryTemplate = (option: any) => {
    if (!option) return null;

    return (
      <div className="d-flex prime-chip align-items-center">
        <ImageWithoutBasePath
          // alt={option.name}
          src={option?.image}
          className="tag-avatar w-14 rounded me-1"
          style={{ width: '18px' }}
        />
        <span>{option.name}</span>
        {/* Remove button */}
        <button
          type="button"
          className="chip-remove"
          onClick={() => removeCountry(option, option?._id)}
        >
          ✕
        </button>
      </div>
    );
  };

  const panelFooterTemplate = () => {
    const length = selectedCountries ? selectedCountries.length : 0;

    return (
      <div className="py-2 px-3">
        <b>{length}</b> item{length > 1 ? 's' : ''} selected.
      </div>
    );
  };

  return (
    <div className="prime-multiselect">
      <MultiSelect
        value={selectedCountries ?? []}
        options={Array.isArray(data) ? data : []}
        onChange={(e: MultiSelectChangeEvent) => {
          setSelectedCountries(e?.value);
          const arr = e?.value?.map((e: any) => e._id);
          setStaff(arr);
          setStaticStaff(arr);
        }}
        optionLabel="name"
        placeholder="Select Staffs"
        itemTemplate={countryTemplate}
        selectedItemTemplate={selectedCountryTemplate}
        panelFooterTemplate={panelFooterTemplate}
        className="multiple-img w-100"
        display="chip"
        showClear
      />
    </div>
  );
}
