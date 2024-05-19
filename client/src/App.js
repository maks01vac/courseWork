import './App.css';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Dashboard from './components/Dashboard/Dashboard';
import Docs from './components/Docs/Docs';

import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext/AuthContext';
import { GraphDataProvider } from './GraphDataContext/GraphDataContext';
// Импортируйте остальные компоненты

function App() {

  const [showLogin, setShowLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <AuthProvider>
      <GraphDataProvider>
        <Router>
          <div className="App">
            <Header
              showLogin={showLogin}
              setShowLogin={setShowLogin}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
            />
            <Routes>
              <Route exact path="/" element={<Main
                setShowLogin={setShowLogin}
                setModalOpen={setModalOpen}/>} />
              <Route path="/dashboard/*" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route exact path="/docs/*" element={<Docs />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </GraphDataProvider>
    </AuthProvider>
  );
}

export default App;