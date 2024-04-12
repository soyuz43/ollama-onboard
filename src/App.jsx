// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { PageOne } from './pages/Page_1';
import { PageTwo } from './pages/Page_2';
import { PageThree } from './pages/Page_3';
import ContentContainer from './components/ContentContainer';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/page-one" element={<ContentContainer><PageOne /></ContentContainer>} />
            <Route path="/page-two" element={<ContentContainer><PageTwo /></ContentContainer>} />
            <Route path="/page-three" element={<ContentContainer><PageThree /></ContentContainer>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
