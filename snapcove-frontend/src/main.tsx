import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./auth/AuthProvider"
import App from "./App"

<BrowserRouter>
 <AuthProvider>
   <App/>
 </AuthProvider>
</BrowserRouter>
