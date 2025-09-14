import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/hooks/useAuth';
import { router, useNavigationContainerRef, useSegments } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useState } from 'react';

export default function RootLayout() {
  useFrameworkReady();
  const { user, userType, loading } = useAuth();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const navigationRef = useNavigationContainerRef();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      setIsNavigationReady(true);
    });

    return unsubscribe;
  }, [navigationRef]);

  useEffect(() => {
    if (loading) {
      console.log('Auth still loading...');
      return;
    }

    if (!isNavigationReady) {
      console.log('Navigation not ready yet...');
      return;
    }

    console.log('Auth state changed:', { hasUser: !!user, userType, segments });
    
    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const inDriverGroup = segments[0] === '(driver)';
    const inAdminGroup = segments[0] === '(admin)';

    if (!user && !inAuthGroup) {
      console.log('No user, redirecting to login');
      // Small delay to ensure smooth transition
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 50);
    } else if (user && inAuthGroup) {
      console.log('User authenticated, redirecting based on user type:', userType);
      setTimeout(() => {
        // Navigate based on user type
        if (userType === 'admin') {
          router.replace('/(admin)/dashboard');
        } else if (userType === 'driver') {
          router.replace('/(driver)/(tabs)/dashboard');
        } else {
          // Default to passenger view
          router.replace('/(tabs)');
        }
      }, 50);
    } else if (user && userType) {
      // Check if user is in the wrong section based on their type
      if (userType === 'admin' && (inTabsGroup || inDriverGroup)) {
        console.log('Admin in wrong section, redirecting to admin section');
        setTimeout(() => {
          router.replace('/(admin)/dashboard');
        }, 50);
      } else if (userType === 'driver' && (inTabsGroup || inAdminGroup)) {
        console.log('Driver in passenger section, redirecting to driver section');
        setTimeout(() => {
          router.replace('/(driver)/(tabs)/dashboard');
        }, 50);
      } else if (userType === 'passenger' && (inDriverGroup || inAdminGroup)) {
        console.log('Passenger in driver section, redirecting to passenger section');
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 50);
      }
    }
  }, [user, userType, loading, segments, isNavigationReady]);

  if (loading) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(driver)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
