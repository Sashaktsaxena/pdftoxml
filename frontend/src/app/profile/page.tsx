// app/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '../components/sidebar/app-sidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset, SidebarRail } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, logout, token } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [conversions, setConversions] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
    if (user?.name) {
      setName(user.name);
    }
    if (token) {
      fetchConversions();
    }
  }, [user, loading, router, token]);

  // const fetchConversions = async () => {
  //   setLoadingData(true);
  //   try {
  //     const response = await fetch('/api/conversions', {
  //       headers: {
  //         'x-auth-token': token,
  //       },
  //     });
  //     const data = await response.json();
  //     setConversions(data);
  //   } catch (err) {
  //     console.error('Failed to fetch conversions', err);
  //   } finally {
  //     setLoadingData(false);
  //   }
  // };

  const handleConversionSelect = (conversionId) => {
    // Navigate to dashboard with the selected conversion
    router.push(`/dashboard?conversion=${conversionId}`);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError('');
    
    try {
      // This would typically be an API call to update the user's profile
      // await api.put('/users/profile', { name });
      
      // For now, we'll just simulate the update
      setTimeout(() => {
        setIsEditing(false);
        setUpdateLoading(false);
      }, 1000);
    } catch (err) {
      setUpdateError('Failed to update profile');
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen bg-[hsl(var(--background))]">
        <AppSidebar
          conversions={conversions}
          onSelect={handleConversionSelect}
          selectedId={null}
          loading={loadingData}
          username={user?.name || "User"}
        />

        <SidebarInset className="transition-all duration-300 ease-in-out bg-[hsl(var(--background))]">
          <div className="p-6 w-full">
            <header className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-muted-foreground">Manage your account settings</p>
              </div>
              <SidebarTrigger className="md:hidden">
                <Menu className="h-6 w-6" />
              </SidebarTrigger>
            </header>

            <div className="max-w-4xl">
              <div className="bg-[hsl(var(--card))] rounded-lg shadow overflow-hidden">
                <div className="px-6 py-8 border-b border-[hsl(var(--border))]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[hsl(var(--card-foreground))]">Profile Information</h2>
                    <button 
                      onClick={logout}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Sign Out
                    </button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6">
                      {isEditing ? (
                        <form onSubmit={handleUpdateProfile}>
                          <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="px-3 py-2 border border-[hsl(var(--input))] rounded-md w-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                              required
                            />
                          </div>
                          
                          {updateError && (
                            <p className="text-red-500 text-sm mb-4">{updateError}</p>
                          )}
                          
                          <div className="flex space-x-3">
                            <button
                              type="submit"
                              disabled={updateLoading}
                              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              {updateLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditing(false);
                                setName(user.name || '');
                              }}
                              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <h2 className="text-xl font-semibold text-[hsl(var(--card-foreground))]">
                            {user.name || 'No name set'}
                          </h2>
                          <p className="text-[hsl(var(--muted-foreground))]">{user.email}</p>
                          {/* <button
                            onClick={() => setIsEditing(true)}
                            className="mt-2 text-sm text-primary hover:text-blue-700 font-medium"
                          >
                            Edit Profile
                          </button> */}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-6">
                  <h3 className="text-lg font-medium text-[hsl(var(--card-foreground))] mb-4">Account Information</h3>
                  <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
                    <div>
                      <dt className="text-sm font-medium text-[hsl(var(--muted-foreground))]">User ID</dt>
                      <dd className="mt-1 text-sm text-[hsl(var(--card-foreground))]">{user._id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Email</dt>
                      <dd className="mt-1 text-sm text-[hsl(var(--card-foreground))]">{user.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Account Status</dt>
                      <dd className="mt-1 text-sm">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          Active
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
        <SidebarRail />
      </div>
    </SidebarProvider>
  );
}