"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { headerContent } from "@/constants/Header"
import UserProfile from "./user-profile-drawer/UserProfile"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/Store"
import { getUserProfile } from "@/redux/slice/UserProfile"

const Header: React.FC = () => {
  const { APP_NAME, LOGIN_LINK_TEXT, REGISTER_LINK_TEXT } = headerContent
  const accessToken = localStorage.getItem("accessToken")
  const [showProfile, setShowProfile] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const userId = localStorage.getItem("userId")
  const { userProfile } = useSelector((state: RootState) => state.userProfile)

  useEffect(() => {
    if (userId) {
      dispatch(getUserProfile(userId as string))
    }
  }, [dispatch , userId]);

  const handleProfileClick = () => {
    setShowProfile(!showProfile)
  }

  return (
    <div className="bg-primary text-white py-3 px-4 sm:px-6 flex justify-between items-center shadow-md relative z-10">
      <h1 className="text-xl font-bold tracking-tight">
        <Link to="/" className="hover:opacity-90 transition-opacity flex items-center">
          {APP_NAME}
        </Link>
      </h1>

      <nav className="flex items-center">
        {accessToken ? (
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
              aria-label="Open profile"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/30 shadow-sm">
                {userProfile?.data?.picture ? (
                  <img
                    className="w-full h-full object-cover"
                    src={userProfile.data.picture || "/placeholder.svg"}
                    alt="Profile"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-primary-foreground flex items-center justify-center text-primary font-medium">
                    {userProfile?.data?.userName?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </button>

            {showProfile && (
              <>
                <div
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
                  onClick={() => setShowProfile(false)}
                ></div>
                <div
                  className="fixed bottom-0 left-0 right-0 bg-white text-black border-t-2 border-border shadow-2xl transition-all ease-in-out duration-300 transform z-40 rounded-t-3xl overflow-hidden"
                  style={{
                    maxHeight: "85vh",
                    height: showProfile ? "85vh" : "0",
                    touchAction: "none",
                  }}
                >
                  <UserProfile setShowProfile={setShowProfile} />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-3 py-1.5 hover:bg-white/10 rounded-md transition-colors">
              {LOGIN_LINK_TEXT}
            </Link>
            <Link to="/register" className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors">
              {REGISTER_LINK_TEXT}
            </Link>
          </div>
        )}
      </nav>
    </div>
  )
}

export default Header
