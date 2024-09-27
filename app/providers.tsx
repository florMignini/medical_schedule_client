"use client"

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const Provider = ({ children }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const [client] = useState(new QueryClient())

    return <QueryClientProvider client={client}>{children}
    <ReactQueryDevtools/>
    </QueryClientProvider>
} 