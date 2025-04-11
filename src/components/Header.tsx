"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, NavigationLink } from "@/components/ui"
import UserProfile from "./user-profile-drawer/UserProfile"
import { headerContent } from "@/constants/Header"
import { useDispatch, useSelector } from "react-redux"
import { getUserProfile } from "@/redux/slice/UserProfile"
import { fetchActiveTimer } from "@/redux/slice/Timer"
import type { AppDispatch, RootState } from "@/redux/Store" // Import your store types
import TimerControls from "./Timer/TimerControls"
import { initializeSocket } from "@/service/socketService"
import { Toaster } from "react-hot-toast"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
} from "@/components/ui/drawer"

const Header = () => {
  const { APP_NAME, LOGIN_LINK_TEXT, REGISTER_LINK_TEXT } = headerContent
  const [, setShowProfile] = useState(false)
  const { userProfile } = useSelector((state: RootState) => state.userProfile) // Add RootState type
  const dispatch = useDispatch<AppDispatch>() // Add AppDispatch type
  const userId = localStorage.getItem("userId")
  const accessToken = localStorage.getItem("accessToken")
  const location = useLocation()
  const [socketInitialized, setSocketInitialized] = useState(false)

  useEffect(() => {
    if (userId) dispatch(getUserProfile(userId))
  }, [dispatch, userId])

  // Initialize socket and fetch active timer for the header controls
  useEffect(() => {
    if (accessToken && !socketInitialized) {
      try {
        initializeSocket(accessToken, dispatch)
        setSocketInitialized(true)
        dispatch(fetchActiveTimer())
      } catch (error) {
        console.error("Error initializing socket in header:", error)
      }
    }
  }, [accessToken, dispatch, socketInitialized])

  const isLoginPage = location.pathname === "/login"
  const isRegisterPage = location.pathname === "/register"

  return (
    <header className="relative z-10 flex items-center justify-between px-4 shadow-md bg-primary text-primary-foreground h-14 sm:px-6">
      <Toaster />
      <Link to="/" className="text-xl font-bold tracking-tight hover:opacity-90">
        {APP_NAME}
      </Link>

      <div className="flex items-center gap-3">
        {accessToken && <TimerControls />}

        {accessToken ? (
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                size="icon"
                aria-label="Open profile"
                className="rounded-full"
              >
                <Avatar
                  variant="default"
                  src={userProfile?.data?.picture}
                  fallback={userProfile?.data?.userName[0] || "A"}
                  className="transition-all hover:border-black"
                />
              </Button>
            </DrawerTrigger>

            <DrawerContent className="fixed right-0 top-0 bottom-0 w-[90vw] sm:w-[400px] bg-background border-l z-50 p-6">
              <UserProfile setShowProfile={setShowProfile} />
            </DrawerContent>
          </Drawer>
        ) : (
          <div className="flex items-center gap-3">
            {isLoginPage ? (
              <NavigationLink to="/register" variant="outline" className="bg-white/10 hover:bg-white/20">
                {REGISTER_LINK_TEXT}
              </NavigationLink>
            ) : isRegisterPage ? (
              <NavigationLink to="/login" variant="outline" className="bg-white/10 hover:bg-white/20">
                {LOGIN_LINK_TEXT}
              </NavigationLink>
            ) : (
              <>
                <NavigationLink to="/login" variant="outline" className="bg-white/10 hover:bg-white/20">
                  {LOGIN_LINK_TEXT}
                </NavigationLink>
                <NavigationLink to="/register" variant="outline" className="bg-white/10 hover:bg-white/20">
                  {REGISTER_LINK_TEXT}
                </NavigationLink>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
