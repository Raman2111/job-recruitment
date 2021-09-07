import React, { useState, useEffect, useRef } from 'react';
import { Button, Col, Row, Form } from 'react-bootstrap';
import SingleJobPageLayouts from '../../layouts/singleJobPage.layouts';
import axios from 'axios';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { getDecoded, getToken } from '../../auth/auth.states';

const FormContainer = styled.div`
  width: 40%;
  margin: 20px auto;
`;

function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);

  const passwordRef = useRef();

  const handlePasswordChange = async (e) => {
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
        { headers: { Authorization: getToken() } }
      );
      if (res) setIsLoading(false);
      toast.success('Password changed successfully');
    } catch (err) {
      toast.error('Failed to change password');
      setIsLoading(false);
    } finally {
    }
  };
  return (
    <SingleJobPageLayouts page='single-job-page'>
      <div className='mb-4 '>
        <Row className='my-4 flex-wrap'>
          <Col sm={12} md={8} className='p-3'>
            <FormContainer>
              <h4 className='text-center'>Change your password</h4>
              <Form onSubmit={(e) => handlePasswordChange(e)}>
                <Form.Group>
                  <Form.Text>New Password</Form.Text>
                  <Form.Control
                    ref={passwordRef}
                    type='password'
                    placeholder='Enter New Password'></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Button type='submit' variant='primary' block disabled={isLoading}>
                    {!isLoading && <span>Submit</span>}
                    {!!isLoading && <span>Submitting...</span>}
                  </Button>
                </Form.Group>
                <Form.Group className='d-flex flex-column align-items-center'></Form.Group>
              </Form>
            </FormContainer>
            <br />
            <br />
            <br />
          </Col>
          <Col sm={12} md={4} className='p-2'>
            <Row className='flex-column align-items-center justify-content-end'>
              <img src='/company-logo.png' alt='company logo' height='200' width='250' />
              <h2 style={{ fontWeight: 300 }}>{}</h2>

              <div className='d-flex align-items-center'>
                <i className='mr-2 text-muted bx bx-mail-send'></i> <span>company@gmail.com</span>
              </div>
            </Row>
          </Col>
        </Row>
        <hr />
      </div>
    </SingleJobPageLayouts>
  );
}

export default ChangePassword;
