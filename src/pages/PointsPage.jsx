import React, { useState } from 'react';
import "../styles/points.css"; 
import { Link } from 'react-router-dom';
import PrimaryButton from '../components/Buttons/PrimaryButton';

const PointsPage = () => {

  return (
    <div className="points-container">
        <div className="points-header">
            <div className="points-header-text">
                <h1>200</h1>
                <p>points</p>
            </div>
            <Link className="link">My points</Link>
        </div>
    
        <div className="points-content">
            <div className="reviews-header">
                <PrimaryButton
                text="write a review" 
                to="/write-review" 
                variant="secondary" 
                onClick={() => setMenuOpen(false)} 
                />
                <PrimaryButton
                text="View reviews" 
                to="/view-reviews" 
                variant="secondary" 
                onClick={() => setMenuOpen(false)} 
                />
            </div>
        </div>
        <div className="badge-container">
            <div className='badge-card'>
                <div className='badge-card-header'>
                    <h2>Earn a badge</h2>
                </div>
                <div className='badge-card-content'>
                    <p>
                    By participating, you earn points; with these points, you can earn a verified badge.
                    </p>
                    <PrimaryButton
                    text="How to earn points" 
                    to="/how-to-earn-points" 
                    variant="primary" 
                    onClick={() => setMenuOpen(false)} 
                    />
                </div>
            </div>
            <div className='badge-card'>
                <div className='badge-card-header'>
                    <h2>Grand Plaza </h2> 
                </div>
                <div className='badge-card-content'>
                    <p>
                        You recently went to the Grand Plaza. Earn points by writing a detailed review. 
                    </p>
                    <PrimaryButton
                    text="How to earn points" 
                    to="/how-to-earn-points" 
                    variant="primary" 
                    onClick={() => setMenuOpen(false)} 
                    />
                </div>
            </div>
        </div>
    </div>
  
  );
};

export default PointsPage;
