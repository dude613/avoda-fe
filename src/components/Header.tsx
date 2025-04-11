//src/components/Header.tsx
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, NavigationLink } from "@/components/ui"
import UserProfile from "./user-profile-drawer/UserProfile"
import { headerContent } from "@/constants/Header"
import { useDispatch, useSelector } from "react-redux"
import { getUserProfile } from "@/redux/slice/UserProfile"
import type { AppDispatch, RootState } from "@/redux/Store"// Import your store types
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

  useEffect(() => {
    if (userId) dispatch(getUserProfile(userId))
  }, [dispatch, userId])

  const isLoginPage = location.pathname === "/login"
  const isRegisterPage = location.pathname === "/register"


  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50 flex h-14 items-center justify-between px-4 sm:px-6">
      <Link
        to="/"
        className="text-xl font-bold tracking-tight hover:opacity-90"
      >
        {APP_NAME}
      </Link>

      <nav>
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
                  className="hover:border-black transition-all"
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
              <NavigationLink
                to="/register"
                variant="outline"
                className="bg-white/10 hover:bg-white/20"
              >
                {REGISTER_LINK_TEXT}
              </NavigationLink>
            ) : isRegisterPage ? (
              <NavigationLink
                to="/login"
                variant="outline"
                className="bg-white/10 hover:bg-white/20"
              >
                {LOGIN_LINK_TEXT}
              </NavigationLink>
            ) : (
              <>
                <NavigationLink
                  to="/login"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20"
                >
                  {LOGIN_LINK_TEXT}
                </NavigationLink>
                <NavigationLink
                  to="/register"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20"
                >
                  {REGISTER_LINK_TEXT}
                </NavigationLink>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
