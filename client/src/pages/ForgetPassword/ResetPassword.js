import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import AuthLayouts from '../../layouts/auth.layouts';

const FormContainer = styled.div`
  width: 40%;
  margin: 20px auto;
`;

const ForgetPassword = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState(1);
  const [token, setToken] = useState('');

  const otpRef = useRef();
  const passwordRef = useRef();

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (!location.state) {
      history.push('/login');
    } else if (!location.state.email) {
      history.push('/login');
    }
  }, []);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const password = passwordRef.current.value;
      console.log('password', password);
      if (!password) {
        toast.error('Password is required.');
        setIsLoading(false);
        return;
      }
      const res = await axios.post(
        `/api/users/password/reset/change`,
        { newPassword: password },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      if (res) setIsLoading(false);
      toast.success('Password changed successfully');
      history.push('/login');
    } catch (err) {
      toast.error('Failed to change password');
      setIsLoading(false);
    } finally {
    }
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();

    const otp = otpRef.current.value;

    setIsLoading(true);
    axios
      .post('/api/users/password/reset/verify', { email: location.state.email, otp })
      .then((res) => {
        setToken(res.data.token);
        toast.success('OTP Verified Successfully');
        setStage(2);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AuthLayouts>
      {stage === 1 && (
        <FormContainer>
          <h4 className='text-center'>Verify OTP</h4>
          <Form onSubmit={(e) => handleOTPSubmit(e)}>
            <Form.Group>
              <Form.Text>OTP</Form.Text>
              <Form.Control
                ref={otpRef}
                type='number'
                placeholder='Enter otp sent to your email'></Form.Control>
            </Form.Group>
            <Form.Group>
              <Button type='submit' variant='primary' block disabled={isLoading}>
                {!isLoading && <span>Verify OTP</span>}
                {!!isLoading && <span>Verifying...</span>}
              </Button>
            </Form.Group>
            <Form.Group className='d-flex flex-column align-items-center'>
              <Link to='/login'>Login as job seeker</Link>
              <Link to='/login/company'>Login as recruiter</Link>
            </Form.Group>
          </Form>
        </FormContainer>
      )}
      {stage === 2 && (
        <FormContainer>
          <h4 className='text-center'>Create New Password</h4>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Group>
              <Form.Text>New Password</Form.Text>
              <Form.Control
                ref={passwordRef}
                type='text'
                placeholder='Enter new password'></Form.Control>
            </Form.Group>
            <Form.Group>
              <Button type='submit' variant='primary' block disabled={isLoading}>
                {!isLoading && <span>Submit</span>}
                {!!isLoading && <span>Submitting...</span>}
              </Button>
            </Form.Group>
            <Form.Group className='d-flex flex-column align-items-center'>
              <Link to='/login'>Login as job seeker</Link>
              <Link to='/login/company'>Login as recruiter</Link>
            </Form.Group>
          </Form>
        </FormContainer>
      )}
    </AuthLayouts>
  );
};

export default ForgetPassword;
