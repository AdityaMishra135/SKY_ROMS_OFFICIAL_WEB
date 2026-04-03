
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

const HUB_OWNERS = ['meinkxun@gmail.com', 'skyhubowner@gmail.com'];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => 
    user ? doc(db, 'users', user.uid) : null
  , [db, user]);
  
  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  useEffect(() => {
    if (!isUserLoading && !isProfileLoading) {
      if (!user) {
        router.push('/');
        toast({ title: "Access Denied", description: "Please login first." });
        return;
      }

      const isSuperAdmin = user.email && HUB_OWNERS.includes(user.email.toLowerCase());
      const isAdminRole = profile?.role === 'admin';
      const isDeveloperRole = profile?.role === 'developer';

      // Only allow entry if they have one of the verified roles
      if (isSuperAdmin || isAdminRole || isDeveloperRole) {
        return;
      }

      router.push('/');
      toast({ 
        variant: "destructive", 
        title: "Restricted Area", 
        description: "Authorized clearance required for this terminal." 
      });
    }
  }, [user, isUserLoading, profile, isProfileLoading, router]);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Scanning Bio-Signatures...</p>
        </div>
      </div>
    );
  }

  const isSuperAdmin = user?.email && HUB_OWNERS.includes(user.email.toLowerCase());
  const isAdminRole = profile?.role === 'admin';
  const isDeveloperRole = profile?.role === 'developer';

  if (!user || (!isSuperAdmin && !isAdminRole && !isDeveloperRole)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background/40 backdrop-blur-sm">
      <main className="max-w-4xl mx-auto py-16 px-6">
        {children}
      </main>
    </div>
  );
}
