import React, { useEffect, useRef, useState } from 'react';
import * as Icon from 'react-feather';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Announcement } from '../../../../GlobleType';
import {
  createAnnoucement,
  deleteAnnoucement,
  updateAnnoucement,
} from '../../../../APICalls';

const AnnouncementsModal = ({ values, updateCus }: Announcement | any) => {
  const [data, setData] = useState(values);
  useEffect(() => {
    setData(values);
  }, [values]);
  const announcementValidationSchema = Yup.object().shape({
    subject: Yup.string().required('Subject is required'),
    message: Yup.string().required('Message is required'),
  });
  const closeModal = (modalId: string) => {
    (
      document.querySelector(`[data-bs-dismiss="modal"]`) as HTMLElement
    )?.click();
  };
  const addRef: any = useRef();
  const editRef: any = useRef();
  const handleAddSubmit = async (values: Announcement) => {
    const res = await createAnnoucement(values);
    if (res?.status == 201) {
      alert(res?.message);
      if (addRef.current) {
        closeModal('');
        addRef.current.setAttribute('data-bs-dismiss', 'modal');
      }
      updateCus();
    }
  };

  const handleEditSubmit = async (v: Announcement) => {
    const res = await updateAnnoucement(v, values?._id);
    if (res?.status == 200) {
      alert(res?.message);
      updateCus();
      if (editRef.current) {
        closeModal('');
        editRef.current.setAttribute('data-bs-dismiss', 'modal');
      }
    }
  };
  const deleteHanlder = async (e: any) => {
    e.currentTarget.setAttribute('data-bs-dismiss', 'modal');
    await deleteAnnoucement(values?._id);
    updateCus();
  };
  return (
    <>
      {/* Add Announcement Modal */}
      <div className="modal fade" id="add-announcement">
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Announcement</h5>
              <button
                type="button"
                className="btn-close close-modal"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <Icon.X className="react-feather-custom" />
              </button>
            </div>
            <div className="modal-body pt-0">
              <Formik
                initialValues={{
                  subject: '',
                  message: '',
                  sendTo: 'all',
                }}
                validationSchema={announcementValidationSchema}
                onSubmit={handleAddSubmit}
              >
                {({ setFieldValue, values, resetForm }) => (
                  <Form>
                    <div className="mb-3">
                      <label className="form-label">Subject</label>
                      <Field
                        name="subject"
                        type="text"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="subject"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Message</label>
                      <Field
                        name="message"
                        as="textarea"
                        className="form-control"
                        rows={3}
                      />
                      <ErrorMessage
                        name="message"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Send To</label>
                      <ul className="custom-radiosbtn">
                        {['all', 'customer', 'staff', 'provider'].map(
                          (option) => (
                            <li key={option}>
                              <label className="radiossets">
                                {option}
                                <Field
                                  type="radio"
                                  name="sendTo"
                                  value={option}
                                  onChange={() =>
                                    setFieldValue('sendTo', option)
                                  }
                                />
                                <span className="checkmark-radio" />
                              </label>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        ref={addRef}
                      >
                        Save
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Announcement Modal */}
      <div className="modal fade" id="edit-announcement">
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Announcement</h5>
              <button
                type="button"
                className="btn-close close-modal"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <Icon.X className="react-feather-custom" />
              </button>
            </div>
            <div className="modal-body pt-0">
              <Formik
                initialValues={{
                  subject: data?.subject,
                  message: data?.message,
                  sendTo: data?.sendTo,
                }}
                enableReinitialize
                validationSchema={announcementValidationSchema}
                onSubmit={(e) => handleEditSubmit(e)}
              >
                {({ setFieldValue }) => (
                  <Form>
                    <div className="mb-3">
                      <label className="form-label">Subject</label>
                      <Field
                        name="subject"
                        type="text"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="subject"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Message</label>
                      <Field
                        name="message"
                        as="textarea"
                        className="form-control"
                        rows={3}
                      />
                      <ErrorMessage
                        name="message"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Send To</label>
                      <ul className="custom-radiosbtn">
                        {['all', 'customer', 'staff', 'provider'].map(
                          (option) => (
                            <li key={option}>
                              <label className="radiossets">
                                {option}
                                <Field
                                  type="radio"
                                  name="sendTo"
                                  value={option}
                                  onChange={() =>
                                    setFieldValue('sendTo', option)
                                  }
                                />
                                <span className="checkmark-radio" />
                              </label>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        ref={editRef}
                      >
                        Save Changes
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Announcement Modal */}
      <div className="modal fade" id="delete-announcement">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body pt-0">
              <div className="text-center">
                <Icon.Trash2 size={40} className="text-danger fs-1" />
                <div className="mt-4">
                  <h4>Delete Announcement?</h4>
                  <p className="text-muted mb-0">
                    Are you sure want to delete this?
                  </p>
                </div>
              </div>
              <div className="d-flex gap-2 justify-content-center mt-4">
                <button
                  type="button"
                  className="btn w-sm btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  data-bs-dismiss="modal"
                  className="btn w-sm btn-danger"
                  onClick={(e) => deleteHanlder(e)}
                >
                  Yes, Delete It!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnnouncementsModal;
