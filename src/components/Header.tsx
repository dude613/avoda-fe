import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { headerContent } from "@/constants/Header";
import UserProfile from './user-profile-drawer/UserProfile';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/Store";
import { getUserProfile } from "@/redux/slice/UserProfle";

const Header: React.FC = () => {

  const { APP_NAME, LOGIN_LINK_TEXT, REGISTER_LINK_TEXT } = headerContent;
  const accessToken = localStorage.getItem("accessToken");
  const [showProfile, setShowProfile] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const userId = localStorage.getItem("userId")
  const { userProfile } = useSelector((state: RootState) => state.userProfile);

  useEffect(() => {
    if (userId) {
      dispatch(getUserProfile(userId as string));
    }
  }, [dispatch, userId]);
  console.log(userProfile)

 

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div className="bg-primary text-white p-4 flex justify-between items-center relative">
      <h1 className="text-xl font-bold">
        <Link to="/">{APP_NAME}</Link>
      </h1>
      <nav className="flex items-center">
        {accessToken ? (
          <>
            <button
              onClick={handleProfileClick}
              className="relative hover:underline"
            >
              <img
                className="w-8 h-8 rounded-full"
                src="/path/to/default-profile.png"
                alt="Profile"
              />
            </button>
            {showProfile && (
              <div
                className={`fixed bottom-0 left-0 right-0 bg-white text-black border-t-2 border-gray-300 shadow-lg transition-all ease-in-out duration-1000 transform z-20 ${showProfile
                  ? "translate-y-0 opacity-100 h-3/4 touch-action-none will-change-transform animation-[popupAnimation] animation-duration-[0.10s] animation-timing-function-[cubic-bezier(0.32,0.72,0,1)]"
                  : "translate-y-full opacity-0 h-0"
                  }`}
              >
                <UserProfile userProfile={userProfile} setShowProfile={setShowProfile}/>
              </div>
            )}
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:underline">
              {LOGIN_LINK_TEXT}
            </Link>
            <Link to="/register" className="hover:underline">
              {REGISTER_LINK_TEXT}
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Header;
