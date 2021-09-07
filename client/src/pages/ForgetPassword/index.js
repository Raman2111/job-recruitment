import axios from 'axios';
import React, { useState, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import AuthLayouts from '../../layouts/auth.layouts';

const FormContainer = styled.div`
  width: 40%;
  margin: 20px auto;
`;

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef();

  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = emailRef.current.value;

    setIsLoading(true);
    axios
      .post('/api/users/password/reset', { email })
      .then((res) => {
        toast.success('An otp has been sent to your email address');
        history.push({ pathname: '/reset-password', state: { email } });
      })
      .catch((err) => {
        toast.error(err?.response?.data?.email);
        toast.error(err?.response?.data?.error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AuthLayouts>
      <FormContainer>
        <h4 className='text-center'>Forget Password</h4>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <Form.Group>
            <Form.Text>Email</Form.Text>
            <Form.Control ref={emailRef} type='email' placeholder='Enter your email'></Form.Control>
          </Form.Group>
          <Form.Group>
            <Button type='submit' variant='primary' block disabled={isLoading}>
              {!isLoading && <span>Send Password Reset Code</span>}
              {!!isLoading && <span>Verifying...</span>}
            </Button>
          </Form.Group>
          <Form.Group className='d-flex flex-column align-items-center'>
            <Link to='/login'>Login as job seeker</Link>
            <Link to='/login/company'>Login as recruiter</Link>
          </Form.Group>
        </Form>
      </FormContainer>
    </AuthLayouts>
  );
};

export default ForgetPassword;
