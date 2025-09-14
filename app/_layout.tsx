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
      return;
    }

    if (!isNavigationReady) {
      return;
    }

    console.log('Auth routing check:', { 
      hasUser: !!user, 
      userType, 
      currentSegments: segments,
      userEmail: user?.email 
    });
    
    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const inDriverGroup = segments[0] === '(driver)';
    const inAdminGroup = segments[0] === '(admin)';

    // If no user, redirect to login
    if (!user && !inAuthGroup) {
      console.log('No user found, redirecting to login');
      router.replace('/(auth)/login');
      return;
    // If user is authenticated but in auth group, redirect to appropriate dashboard
    } else if (user && inAuthGroup) {
      console.log('User authenticated, routing to correct interface for:', userType);
      
      if (userType === 'driver') {
        console.log('Redirecting driver to driver dashboard');
        router.replace('/(driver)/(tabs)/dashboard');
      } else if (userType === 'admin') {
        console.log('Redirecting admin to admin dashboard');
        router.replace('/(admin)/dashboard');
      } else {
        console.log('Redirecting passenger to passenger interface');
        router.replace('/(tabs)');
      }
      return;
    }

    // If user is in wrong section based on their type, redirect them
    if (user && userType) {
      let shouldRedirect = false;
      let redirectPath = '';

      if (userType === 'driver' && !inDriverGroup) {
        console.log('Driver in wrong section, redirecting to driver interface');
        shouldRedirect = true;
        redirectPath = '/(driver)/(tabs)/dashboard';
      } else if (userType === 'admin' && !inAdminGroup) {
        console.log('Admin in wrong section, redirecting to admin interface');
        shouldRedirect = true;
        redirectPath = '/(admin)/dashboard';
      } else if (userType === 'passenger' && !inTabsGroup) {
        console.log('Passenger in wrong section, redirecting to passenger interface');
        shouldRedirect = true;
        redirectPath = '/(tabs)';
      }

      if (shouldRedirect) {
        router.replace(redirectPath);
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
