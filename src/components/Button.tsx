import { Button as NativeBaseButton, IButtonProps, Text } from 'native-base';

export interface IButton extends IButtonProps {
  title: string;
  variant?: 'outline' | 'solid';
}

export function Button(props: IButton) {
  const { title, variant = 'solid', ...rest } = props;

  return (
    <NativeBaseButton
      rounded='sm'
      w='full'
      h={14}
      borderWidth={variant === 'outline' ? 1 : 0}
      borderColor='green.500'
      bg={variant === 'outline' ? 'transparent' : 'green.700'}
      _pressed={{
        bg: variant === 'outline' ? 'gray.500' : 'green.500',
      }}
      {...rest}
    >
      <Text
        color={variant === 'outline' ? 'green.500' : 'white'}
        fontFamily='heading'
        fontSize='sm'
        letterSpacing='lg'
      >
        {title}
      </Text>
    </NativeBaseButton>
  );
}
