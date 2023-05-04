import { Image, IImageProps } from 'native-base';

export interface IUserPhoto extends IImageProps {
  size: number;
}

export function UserPhoto(props: IUserPhoto) {
  const { size, ...rest } = props;
  return (
    <Image
      width={size}
      height={size}
      rounded='full'
      borderWidth='2'
      borderColor='gray.400'
      {...rest}
    />
  );
}
