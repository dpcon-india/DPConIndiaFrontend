import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DefaultEditor from 'react-simple-wysiwyg';
import { Dropdown } from 'primereact/dropdown';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { api, formDataHeader } from '../../../config';
interface Blog {
  categoryId?: string | any;
  slug?: string;
  categoryName: string;
  title: string;
  image: string;
  category: string;
  createdAt: string;
  metaDescription: string;
  description: string;
  _id: string;
}
interface Language {
  name: string;
}

interface Category {
  _id: string;
  categoryName: string;
}

const EditBlog = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const location = useLocation();
  const [blog, setBlog] = useState<Blog>(location.state);

  const navigate = useNavigate();

  useEffect(() => {
    setBlog(location.state);
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${api}categories`);
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const languages = [{ name: 'English' }, { name: 'German' }];

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    // categoryId: Yup.object().nullable().required('Category is required'),
    slug: Yup.string().required('Slug is required'),
    metaDescription: Yup.string().required('Meta Description is required'),
    // metaKeywords: Yup.string().required('Meta Keywords are required'),
    image: Yup.mixed().nullable().required('Image is required'),
    description: Yup.string().required('Description is required'),
  });

  const handleSubmit = async (
    values: any,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    const formData = new FormData();
    formData.append('title', values.title);
    // formData.append('categoryId', values.categoryId._id);
    formData.append('slug', values.slug);
    formData.append('metaDescription', values.metaDescription);
    formData.append('metaKeywords', values.metaKeywords);

    if (values.image) {
      formData.append('image', values.image);
    }

    formData.append('description', values.description);

    try {
      await axios.put(`${api}blogs/${blog?._id}`, formData, formDataHeader);
      alert('Blog post updated successfully!');
      navigate('/admin/blog/all-blog');
    } catch (error) {
      console.error('Error adding blog post:', error);
      alert('Failed to add blog post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <Formik
          initialValues={{
            title: blog?.title || '',
            // categoryId: null,
            slug: blog?.slug || '',
            metaDescription: blog?.metaDescription || '',
            // metaKeywords: blog?.metaKeywords || '',
            image: blog?.image || '',
            description: blog?.description || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form>
              <div className="row">
                <div className="col-lg-7 col-sm-12 m-auto">
                  <div className="content-page-header">
                    <h5>Add Blog</h5>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Title</label>
                        <Field name="title" className="form-control" />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                    {/* <div className="col-lg-12">
                      <div className="form-group">
                        <label>Category</label>
                        <Dropdown
                          value={null}
                          options={categories}
                          optionLabel="categoryName"
                          placeholder="Select Category"
                          className="select w-100"
                          onChange={(e) => setFieldValue('categoryId', e.value)}
                        />
                        <ErrorMessage
                          name="categoryId"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div> */}
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Slug</label>
                        <Field name="slug" className="form-control" />
                        <ErrorMessage
                          name="slug"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Description (Meta Tag)</label>
                        <Field
                          name="metaDescription"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="metaDescription"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                    {/* <div className="col-lg-12">
                      <div className="form-group">
                        <label>Keywords (Meta Tag)</label>
                        <Field name="metaKeywords" className="form-control" />
                        <ErrorMessage
                          name="metaKeywords"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div> */}
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Blog Image</label>
                        <input
                          type="file"
                          onChange={(e) =>
                            setFieldValue(
                              'image',
                              e.target.files ? e.target.files[0] : null,
                            )
                          }
                        />
                        <ErrorMessage
                          name="image"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Description</label>
                        <DefaultEditor
                          value={values.description}
                          onChange={(e) =>
                            setFieldValue('description', e.target.value)
                          }
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="btn-path">
                        <Link to="#" className="btn btn-cancel me-3">
                          Cancel
                        </Link>
                        <button
                          className="btn btn-primary"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Save Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditBlog;
