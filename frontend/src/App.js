import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router";
import { useNavigate } from "react-router-dom";
// Importing all pages (components) for different routes
import AddLearningPlan from "./Pages/LearningPlan/AddLearningPlan";
import AllLearningPlan from "./Pages/LearningPlan/AllLearningPlan";
import UpdateLearningPlan from "./Pages/LearningPlan/UpdateLearningPlan";
import UserLogin from "./Pages/UserManagement/UserLogin";
import UserRegister from "./Pages/UserManagement/UserRegister";
import UpdateUserProfile from "./Pages/UserManagement/UpdateUserProfile";
import AddAchievements from "./Pages/AchievementsManagement/AddAchievements";
import AllAchievements from "./Pages/AchievementsManagement/AllAchievements";
import UpdateAchievements from "./Pages/AchievementsManagement/UpdateAchievements";
import NotificationsPage from "./Pages/NotificationManagement/NotificationsPage";
import AddNewPost from "./Pages/PostManagement/AddNewPost";
import AllPost from "./Pages/PostManagement/AllPost";
import UpdatePost from "./Pages/PostManagement/UpdatePost";
import UserProfile from "./Pages/UserManagement/UserProfile";
import MyAchievements from "./Pages/AchievementsManagement/MyAchievements";
import MyAllPost from "./Pages/PostManagement/MyAllPost";
import GoogalUserPro from "./Pages/UserManagement/GoogalUserPro";
import MyLearningPlan from "./Pages/LearningPlan/MyLearningPlan";

// ProtectedRoute Component
// This component ensures that certain routes are only accessible if the user is logged in (has a valid "userID").
function ProtectedRoute({ children }) {
  const userID = localStorage.getItem("userID"); // Retrieve userID from localStorage
  if (!userID) {
    return <Navigate to="/" />; // If no userID exists, redirect to the login page
  }
  return children; // If userID exists, render the child components (i.e., protected routes)
}

function App() {
  const navigate = useNavigate(); // Hook to programmatically navigate between routes

  // Effect to handle Google OAuth callback and store user data in localStorage
  useEffect(() => {
    // If the current URL path is "/oauth2/success", it's an indication that the user has logged in through Google OAuth
    if (window.location.pathname === "/oauth2/success") {
      // Retrieve the user data from URL query parameters
      const params = new URLSearchParams(window.location.search);
      const userID = params.get("userID");
      const name = params.get("name");
      const googleProfileImage = decodeURIComponent(params.get("googleProfileImage")); // Decode the Google Profile Image URL

      if (userID && name) {
        // Store the user data in localStorage for future reference
        localStorage.setItem("userID", userID);
        localStorage.setItem("userType", "google");
        if (googleProfileImage) {
          localStorage.setItem("googleProfileImage", googleProfileImage); // Save the decoded URL of the profile image
        }
        navigate("/allPost"); // Redirect the user to the "All Posts" page after successful login
      } else {
        alert("Login failed. Missing user information.");
      }
    }
  }, [navigate]); // Run the effect when the component is mounted or the URL changes

  return (
    <div>
      <React.Fragment>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<UserLogin />} /> {/* Login page */}
          <Route path="/register" element={<UserRegister />} /> {/* Register page */}

          {/* Protected Routes (Requires user to be logged in) */}
          <Route
            path="/addLearningPlan"
            element={
              <ProtectedRoute>
                <AddLearningPlan /> {/* Page to add a new learning plan */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/allLearningPlan"
            element={
              <ProtectedRoute>
                <AllLearningPlan /> {/* Page to view all learning plans */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/myLearningPlan"
            element={
              <ProtectedRoute>
                <MyLearningPlan /> {/* Page to view current user's learning plans */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/updateLearningPlan/:id"
            element={
              <ProtectedRoute>
                <UpdateLearningPlan /> {/* Page to update an existing learning plan */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/updateUserProfile/:id"
            element={
              <ProtectedRoute>
                <UpdateUserProfile /> {/* Page to update user profile information */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/userProfile"
            element={
              <ProtectedRoute>
                <UserProfile /> {/* Page to view user profile */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/googalUserPro"
            element={
              <ProtectedRoute>
                <GoogalUserPro /> {/* Page for Google user profile details */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/addAchievements"
            element={
              <ProtectedRoute>
                <AddAchievements /> {/* Page to add new achievements */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/allAchievements"
            element={
              <ProtectedRoute>
                <AllAchievements /> {/* Page to view all achievements */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/myAchievements"
            element={
              <ProtectedRoute>
                <MyAchievements /> {/* Page to view the current user's achievements */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/updateAchievements/:id"
            element={
              <ProtectedRoute>
                <UpdateAchievements /> {/* Page to update an existing achievement */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage /> {/* Page to manage notifications */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/addNewPost"
            element={
              <ProtectedRoute>
                <AddNewPost /> {/* Page to create a new post */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/allPost"
            element={
              <ProtectedRoute>
                <AllPost /> {/* Page to view all posts */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/myAllPost"
            element={
              <ProtectedRoute>
                <MyAllPost /> {/* Page to view posts created by the current user */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/updatePost/:id"
            element={
              <ProtectedRoute>
                <UpdatePost /> {/* Page to update an existing post */}
              </ProtectedRoute>
            }
          />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
