// Components/MyForm.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const MyForm = () => (
    <Formik
        initialValues={{ email: '' }}
        validate={values => {
            const errors = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/\S+@\S+\.\S+/.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
            }, 400);
        }}
    >
        {({ isSubmitting }) => (
            <Form>
                <Field type="email" name="email" />
                <ErrorMessage name="email" component="div" />
                <button type="submit" disabled={isSubmitting}>
                    Submit
                </button>
            </Form>
        )}
    </Formik>
);

export default MyForm;