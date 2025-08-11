import { Dropdown } from 'primereact/dropdown';
import React, { useState } from 'react';
import { updateBookingStaff, updateBookingStatus } from '../../../../APICalls';

const StaffSelect = ({ staff, bookId }: any) => {
  const [staffName, setStaff] = useState<string>();

  // Map staff array to the structure PrimeReact Dropdown expects
  const staffOptions = staff.map((s: any) => ({ label: s.name, value: s._id }));

  const handleChange = async (e: { value: string }) => {
    setStaff(e.value); // Set the selected value
    const updateBook = await updateBookingStatus('accepted', bookId);
    const updateBookSTaff = await updateBookingStaff(e.value, bookId);
  };

  return (
    <Dropdown
      value={staffName}
      onChange={handleChange}
      options={staffOptions}
      placeholder="Select Staff"
      className="select w-100"
    />
  );
};

export default StaffSelect;
