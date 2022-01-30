import styled from 'styled-components';

export const Overlay = styled.div`
  width: 100vw;
  height: 100vh;

  background-color: rgba(128, 128, 128, 0.7);
  position: fixed;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Label = styled.div`
  align-self: center;
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
  color: white;
`;
