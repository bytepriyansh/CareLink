
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Assistant from "./pages/Assistant";
import BodyLangAI from "./pages/BodyLangAI";


const App = () => (

        <BrowserRouter>
          <div className="min-h-screen w-full">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/assistant" element={<Assistant />} />
          
              <Route path="/body" element={<BodyLangAI />} />
            </Routes>
          </div>
        </BrowserRouter>
     
);

export default App;