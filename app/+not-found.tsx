import { Link, Stack } from 'expo-router';
import { Button, StyleSheet, Text } from 'react-native';
import { ScreenContainer } from 'react-native-screens';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenContainer className='flex-1 items-center justify-center dark:bg-gray-900'>
        <Text className='text-2xl font-bold dark:text-white'>Oops!</Text>
        <Text className='text-9xl font-bold dark:text-white'>404</Text>
        <Text className='text-xl font-bold dark:text-white'>This page doesn't exist.</Text>
        <Link href="/" className='mt-4 text-blue-500 dark:text-blue-400'>
          <Button title="Go to the home screen" />
        </Link>
      </ScreenContainer>
    </>
  );
}
