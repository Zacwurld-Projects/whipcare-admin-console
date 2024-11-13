import React, { createContext, ReactNode, FunctionComponent, useState, useEffect } from "react";

/**
 * The data type for the application context
 */
export type AdminUserContextData = {
};

/**
 * The context for the application
 */
const AdminUserContext = createContext<AdminUserContextData | undefined>(undefined);

// Create a provider component that takes children as props
type AdminUserProviderProps = {
    children: ReactNode;
};

const AdminUserProvider: FunctionComponent<AdminUserProviderProps> = ({ children }) => {

    // Define the values you want to share
    const sharedData: AdminUserContextData = {
    };

    return (
        <AdminUserContext.Provider value={sharedData}>
            {children}
        </AdminUserContext.Provider>
    );
};

export { AdminUserProvider, AdminUserContext };
