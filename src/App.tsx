
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Assistant from "./pages/Assistant";
import BodyLangAI from "./pages/BodyLangAI";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import { Navbar } from "./components/Navbar";


const App = () => (

        <BrowserRouter>
          <div className="min-h-screen w-full">
                        <Navbar />

            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/assistant" element={<Assistant />} />
                        <Route path="/profile" element={<Profile />} />

              <Route path="/body" element={<BodyLangAI />} />
                            <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
     
);

export default App;