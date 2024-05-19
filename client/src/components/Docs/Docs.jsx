import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DocumentationSidebar from './DocumentationSidebar/DocumentationSidebar';
import './style/Docs.css';

// Предварительно создайте эти компоненты для каждого маршрута документации
import Overview from './DocsPages/Overview/Overview';
import GoalsBenefits from './DocsPages/GoalsBenefits/GoalsBenefits';
import MainDescription from './DocsPages/MainDescription/MainDescription';
import MainFeatures from './DocsPages/MainFeatures/MainFeatures';
// Добавьте остальные компоненты для каждой секции

const Docs = () => {
    return (
        <div className="docs-container">
            {/* Сайдбар с левой стороны */}
            <DocumentationSidebar />
            <div className="docs-content">
                <Routes>
                    <Route path="introduction/overview" element={<Overview />} />
                    <Route path="introduction/goals-benefits" element={<GoalsBenefits />} />
                    <Route path="main/description" element={<MainDescription />} />
                    <Route path="main/features" element={<MainFeatures />} />
                </Routes>
            </div>

        </div>
    );
};

export default Docs;