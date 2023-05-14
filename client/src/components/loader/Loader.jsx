import React from 'react';
import { css } from '@emotion/react';
import { BeatLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: blue;
`;

const Loader = ({ isVisible }) => {
  return (
    <BeatLoader
      css={override}
      color={'#4682b4'}
      loading={isVisible}
    />
  );
}

export default Loader;