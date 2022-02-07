import React, {useMemo, useRef, useState} from 'react';
// @ts-ignore
import EventStream from "eventing-bus/lib/event_stream";


export const GlobalContext = React.createContext({});

export const GlobalContextProvider = ({children}: any) => {
    const eventBusRef = useRef(new EventStream());
    const [storeValue, setStoreValue] = useState({
        eventBus: eventBusRef.current
    })
    const contextValue = useMemo(() => ({value: storeValue, setValue: setStoreValue}), [storeValue]);
    return (
        <GlobalContext.Provider value={contextValue}>
            {children}
        </GlobalContext.Provider>
    )
}