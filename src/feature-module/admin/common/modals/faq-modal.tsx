import React, { useEffect, useRef, useState } from 'react';
import * as Icon from 'react-feather';
import { Dropdown } from 'primereact/dropdown';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Category, FAQ } from '../../../../GlobleType';
import { createFAQ, fetchCategories, updateFAQ } from '../../../../APICalls';
declare global {
  interface Window {
    bootstrap: any;
  }
}
const FaqModal = ({ fromParent, updateCus }: FAQ | any) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [data, setData] = useState<FAQ>(fromParent);
  const addRef: any = useRef();
  const editRef: any = useRef();
  useEffect(() => {
    setData(fromParent);
  }, [fromParent]);

  const closeModal = (modalId: string) => {
    (
      document.querySelector(`[data-bs-dismiss="modal"]`) as HTMLElement
    )?.click();
  };
  const fetchCat = async () => {
    try {
      const categories = await fetchCategories();
      setCategoryList(categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCat();
  }, []);

  // Validation schema for Formik (optional)
  const validationSchema = Yup.object({
    question: Yup.string().required('question is required'),
    category: Yup.string().required('Category is required'),
    answer: Yup.string().required('Answer is required'),
  });

  // Initial values for the form (Add FAQ example)
  const initialValues = {
    question: '',
    category: '',
    answer: '',
  };

  const handleSubmit = async (values: any) => {
    const res = await createFAQ(values);
    if (res?.status == 201) {
      alert(res?.message);
      if (addRef.current) {
        closeModal('add-category');

        addRef.current.setAttribute('data-bs-dismiss', 'modal');
      }
      updateCus();
    }
  };
  const editHandler = async (values: any) => {
    const res = await updateFAQ(values, data._id);
    if (res?.status == 200) {
      alert(res?.message);
      updateCus();
      if (editRef.current) {
        closeModal('add-category');
        editRef.current.setAttribute('data-bs-dismiss', 'modal');
      }
    }
  };
  return (
    <>
      {/* Add FAQ */}
      <div className="modal fade" id="add-faq">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add FAQ</h5>
              <button
                type="button"
                className="btn-close close-modal"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <Icon.X className="react-feather-custom me-2" />
              </button>
            </div>
            <div className="modal-body pt-0">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue, values, errors, touched }) => (
                  <Form>
                    <div className="mb-3">
                      <label className="form-label">question</label>
                      <Field
                        name="question"
                        type="text"
                        className="form-control"
                      />
                      {errors.question && touched.question && (
                        <div className="text-danger">{errors.question}</div>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Category</label>
                      <select
                        name="category"
                        className="form-control"
                        onChange={(e: any) => {
                          setFieldValue('category', e.target.value);
                        }}
                      >
                        {categoryList?.map((e: Category, i: number) => (
                          <option value={e._id} key={i}>
                            {e.categoryName}
                          </option>
                        ))}
                      </select>
                      {errors.category && touched.category && (
                        <div className="text-danger">{errors.category}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Answer</label>
                      <Field
                        name="answer"
                        as="textarea"
                        className="form-control"
                      />
                      {errors.answer && touched.answer && (
                        <div className="text-danger">{errors.answer}</div>
                      )}
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
      {/* /Add FAQ */}

      {/* Edit FAQ */}
      <div className="modal fade" id="edit-faq">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit FAQ</h5>
              <button
                type="button"
                className="btn-close close-modal"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <Icon.X className="react-feather-custom me-2" />
              </button>
            </div>
            <div className="modal-body pt-0">
              <Formik
                initialValues={{
                  question: data?.question,
                  category: data?.category?._id,
                  answer: data?.answer,
                }}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={editHandler}
              >
                {({ setFieldValue, values, errors, touched }) => (
                  <Form>
                    <div className="mb-3">
                      <label className="form-label">question</label>
                      <Field
                        name="question"
                        type="text"
                        className="form-control"
                      />
                      {errors.question && touched.question && (
                        <div className="text-danger">
                          {String(errors.question)}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        name="category"
                        className="select w-100 form-control"
                        id="category"
                        value={values.category} // Set the value of the select element to reflect the form state
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          setFieldValue('category', e.target.value);
                        }}
                      >
                        {categoryList?.map((e: Category, i: number) => (
                          <option value={e._id} key={i}>
                            {e.categoryName}
                          </option>
                        ))}
                      </select>
                      {errors.category && touched.category && (
                        <div className="text-danger">
                          {String(errors.category)}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Answer</label>
                      <Field
                        name="answer"
                        as="textarea"
                        className="form-control"
                      />
                      {errors.answer && touched.answer && (
                        <div className="text-danger">
                          {String(errors.answer)}
                        </div>
                      )}
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
      {/* /Edit FAQ */}
    </>
  );
};

export default FaqModal;
