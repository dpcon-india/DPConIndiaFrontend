import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { updateBookingStaff, updateBookingStatus } from '../../../../APICalls';

const StaffBookingStatus = ({ bookings, updatedBooking }: any) => {
  const [status, setStatus] = useState<any>();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleChange = (e: any) => {
    if (e?.value == bookings.status) return;
    setSelectedStatus(e.value);
    setShowModal(true); // Open the modal
  };

  const confirmChange = async () => {
    if (bookings.status == 'pending') {
      const id = JSON.parse(localStorage.getItem('user') || '{}')._id;
      const updateBookSTaff = await updateBookingStaff(id, bookings?._id);
    }
    const updateStatus = await updateBookingStatus(
      selectedStatus,
      bookings?._id,
    );
    if (updateStatus?.status != 200) {
      setMessage(updateStatus?.message);
      setError(true);
      return;
    }
    updatedBooking();
    setStatus(selectedStatus);
    setShowModal(false); // Close the modal
  };

  const cancelChange = () => {
    setSelectedStatus(null);
    setShowModal(false);
  };
  const cancelError = () => {
    setSelectedStatus(null);
    setError(false);
    setShowModal(false);
  };
  return (
    <div>
      <Dropdown
        value={status}
        onChange={handleChange}
        options={['accepted', 'progress', 'pending', 'completed']}
        placeholder={bookings?.status}
        className="select w-100"
      />

      <Dialog
        header="Confirm Status Change"
        visible={showModal}
        onHide={cancelChange}
        footer={
          <div>
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={cancelChange}
              className="p-button-text"
            />
            <Button
              label="Confirm"
              icon="pi pi-check"
              onClick={confirmChange}
              autoFocus
            />
          </div>
        }
      >
        <p>
          Are you sure you want to change the status to{' '}
          <strong>{selectedStatus}</strong>?
        </p>
      </Dialog>

      <Dialog
        header={'Error Changing Status'}
        visible={error}
        onHide={cancelError}
        footer={
          <div>
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={cancelError}
              className="p-button-text"
            />
            <Button
              label="Ok"
              icon="pi pi-check"
              onClick={cancelError}
              autoFocus
            />
          </div>
        }
      >
        <p>{message}</p>
      </Dialog>
    </div>
  );
};

export default StaffBookingStatus;
