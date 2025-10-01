import { Routes, Route, Navigate } from "react-router-dom";
import { Hierarchy } from "./pages/Hierarchy";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route
        path='/hierarchy'
        element={
          <ProtectedRoute>
            <Hierarchy />
          </ProtectedRoute>
        }
      />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}

export default App;
