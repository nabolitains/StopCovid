import React from 'react';
import {Text} from 'react-native'
import styled from 'styled-components/native';
import { Image } from 'react-native';

import { scale } from '../../utils';

const Wrapper = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const Footer = () => (
  <Wrapper> 
    <Text>Qsolution Service Sarl. Djibouti</Text> 
  </Wrapper>
);

export default Footer;
