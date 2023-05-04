import {
  Input as NativeBaseInput,
  IInputProps,
  FormControl,
} from 'native-base';

export interface IInput extends IInputProps {
  errorMsg?: string | null;
}

export function Input(props: IInput) {
  const { errorMsg = null, isInvalid, ...rest } = props;
  const isInputInvalid = !!errorMsg || isInvalid;

  return (
    <FormControl mb={4} isInvalid={isInputInvalid}>
      <NativeBaseInput
        bg='gray.700'
        h={14}
        px={4}
        borderWidth={0}
        fontSize='md'
        color='white'
        fontFamily='body'
        placeholderTextColor='gray.300'
        isInvalid={isInputInvalid}
        _focus={{
          bg: 'gray.700',
          borderWidth: 1,
          borderColor: 'green.500',
        }}
        _invalid={{
          borderWidth: 1,
          borderColor: 'red.500',
        }}
        {...rest}
      />
      <FormControl.ErrorMessage
        _text={{
          color: 'red.500',
        }}
      >
        {errorMsg}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
