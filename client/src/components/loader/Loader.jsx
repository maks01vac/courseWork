import React from 'react';
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';
import './style/Loader.css';

const override = css`
  display: block;
  margin: 0 auto;
`;

const Loader = ({ isVisible }) => {
  return (
    <div className="loader-box">
    <ClipLoader
      size={50}
      css={override}
      color={'#0d4c6a'}
      loading={isVisible}
    />
    </div>

  );
}

export default Loader;