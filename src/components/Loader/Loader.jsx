import { Triangle } from 'react-loader-spinner';

export const Loader = () => {
  return (
    <>
      <Triangle
        height="80"
        width="80"
        color="red"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass="override"
      />
    </>
  );
};
