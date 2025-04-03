import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, NavigationLink } from "@/components/ui"
import { Drawer } from "@/components/drawer"
import UserProfile from "./user-profile-drawer/UserProfile"
import { headerContent } from "@/constants/Header"
import { useDispatch, useSelector } from "react-redux"
import { getUserProfile } from "@/redux/slice/UserProfile"
import type { AppDispatch, RootState } from "@/redux/Store"// Import your store types

const Header = () => {
  const { APP_NAME, LOGIN_LINK_TEXT, REGISTER_LINK_TEXT } = headerContent
  const [showProfile, setShowProfile] = useState(false)
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

  console.log("isRegisterPage", isRegisterPage);

  return (
    <header className="bg-primary text-primary-foreground shadow-md relative z-10 flex h-14 items-center justify-between px-4 sm:px-6">
      <Link
        to="/"
        className="text-xl font-bold tracking-tight hover:opacity-90"
      >
        {APP_NAME}
      </Link>

      <nav>
        {accessToken ? (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/10 focus:ring-white/50"
              onClick={() => setShowProfile(!showProfile)}
              aria-label="Open profile"
            >
              <Avatar
                variant="default"
                src={userProfile?.data?.picture}
                fallback={userProfile?.data?.userName || "User"}
                className="border-white/30"
              />
            </Button>

            <Drawer
              isOpen={showProfile}
              onClose={() => setShowProfile(false)}
              className="max-h-[85vh]"
            >
              <UserProfile setShowProfile={setShowProfile} />
            </Drawer>
          </div>
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