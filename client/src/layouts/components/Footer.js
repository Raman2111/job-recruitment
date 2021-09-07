import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.div`
  width: 100%;
  background-color: #343a40;
  padding: 20px 0px;
  border-top-left-radius: 0%;
  border-top-right-radius: 0%;
  text-align: center;
`;

function Footer() {
  return (
    <FooterContainer>
      <span className='medium text-light'>Copyright ©2021 All rights reserved</span>
    </FooterContainer>
  );
}

export default Footer;
