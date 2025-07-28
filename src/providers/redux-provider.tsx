"use client"

import { persistor, store } from '@/lib/store'
import NextTopLoader from 'nextjs-toploader'
import { Fragment, PropsWithChildren } from 'react'
import { MdErrorOutline } from "react-icons/md"
import { PiConfettiLight } from "react-icons/pi"
import { Provider } from "react-redux"
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from "sonner"
import { disableConsoleLogsInProduction } from '@/lib/utils'

disableConsoleLogsInProduction();

function ReduxContent({ children }: PropsWithChildren) {
    // useSocketEvents()
    return (
        <Fragment>
            <NextTopLoader
                color="#EF4136"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={true}
                easing="ease"
                speed={200}
                zIndex={1600}
            />
            <Toaster richColors
                expand={false}
                visibleToasts={2}
                position='top-right' icons={{
                    success: <PiConfettiLight size={29} className='pr-2 rounded font-lato' />,
                    error: <MdErrorOutline size={29} className='pr-2 rounded' />
                }} />
            <PersistGate persistor={persistor}>
                {children}
            </PersistGate>
        </Fragment>
    )
}

export default function ReduxProvider({ children }: PropsWithChildren) {
    return (
        <Provider store={store}>
            <ReduxContent>
                {children}
            </ReduxContent>
        </Provider>
    )
}
