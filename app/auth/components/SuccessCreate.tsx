import FormContainer from "./FormContainer";
import SuccessIcon from "../assets/successIcon.svg";
import FormButton from "./FormButton";

const SuccessCreate = () => {
  return (
    <FormContainer>
      <SuccessIcon />
      <h3 className='heading-h3 my-[2px] text-center font-semibold  text-gray-800'>
        Congratulations, your account is activated now
      </h3>
      <FormButton type='link' text='Go to Dashboard' linkTo={"/dashboard"} />
    </FormContainer>
  );
};
export default SuccessCreate;
