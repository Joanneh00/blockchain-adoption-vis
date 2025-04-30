// export default BlockchainMLModel;

import React, { useState, useEffect } from 'react';
import './BlockchainMLModel.css'; // Import the CSS file we'll create

// Machine learning model coefficients from our analysis
const LINEAR_REGRESSION_MODEL = {
  weights: [0.3222, -0.0331,-0.0814, 0.3379, 0.3868],
  bias: 0.0516
};

const COMBINED_MODEL = {
  weights: [0.0811,-0.0030,-0.1430,0.2330,0.2009,0.1665,0.1664,0.2065],
  bias: 0.1489
};

//TODO: Change the value
// Feature importance percentages
const FEATURE_IMPORTANCE = [
  { name: "Compatibility (CPT)", importance: 22.54, weight: 0.2799 },
  { name: "Relative Advantage (RAD)", importance: 7.04, weight: -0.0875 },
  { name: "Complexity (CPX)", importance: 8.62, weight: -0.1070 },
  { name: "Subjective Norms (SN)", importance: 34.83, weight: 0.4325 },
  { name: "Perceived Behavioral Control (PBC)", importance: 26.97, weight: 0.3349 }
];

const COMBINED_FEATURE_IMPORTANCE = [
  { name: "Compatibility (CPT)", importance: 4.03, weight: 0.0468 },
  { name: "Relative Advantage (RAD)", importance: 0.72, weight: 0.0084 },
  { name: "Complexity (CPX)", importance: 9.91, weight: -0.1149 },
  { name: "Subjective Norms (SN)", importance: 16.01, weight: 0.1857 },
  { name: "Perceived Behavioral Control (PBC)", importance: 17.79, weight: 0.2063 },
  { name: "Perceived Ease of Use (PEOU)", importance: 12.81, weight: 0.1485 },
  { name: "Perceived Usefulness (PU)", importance: 22.26, weight: 0.2581 },
  { name: "Attitude (ATT)", importance: 16.46, weight: 0.1908 }
];
// TODO: Change the value
// Performance metrics
const MODEL_PERFORMANCE = {
  linearRegression: {
    trainR2: 0.6276,
    testR2: 0.4925
  },
  decisionTree: {
    trainR2: 0.7295,
    testR2: 0.0596
  },
  combinedModel: {
    trainR2: 0.6745,
    testR2: 0.7054
  },
  randomForest: {
    trainR2: 0.7624,
    testR2: 0.6946
  }
};

// Function to predict BI using linear regression model
const predictBI = (inputs) => {
  const { CPT, RAD, CPX, SN, PBC } = inputs;
  let prediction = LINEAR_REGRESSION_MODEL.bias;
  prediction += LINEAR_REGRESSION_MODEL.weights[0] * CPT;
  prediction += LINEAR_REGRESSION_MODEL.weights[1] * RAD;
  prediction += LINEAR_REGRESSION_MODEL.weights[2] * CPX;
  prediction += LINEAR_REGRESSION_MODEL.weights[3] * SN;
  prediction += LINEAR_REGRESSION_MODEL.weights[4] * PBC;
  
  return Math.max(1, Math.min(5, prediction)); // Ensure prediction is between 1-5
};

// Function to predict BI using combined model
const predictBICombined = (inputs) => {
  const { CPT, RAD, CPX, SN, PBC, PEOU, PU, ATT } = inputs;
  let prediction = COMBINED_MODEL.bias;
  prediction += COMBINED_MODEL.weights[0] * CPT;
  prediction += COMBINED_MODEL.weights[1] * RAD;
  prediction += COMBINED_MODEL.weights[2] * CPX;
  prediction += COMBINED_MODEL.weights[3] * SN;
  prediction += COMBINED_MODEL.weights[4] * PBC;
  prediction += COMBINED_MODEL.weights[5] * PEOU;
  prediction += COMBINED_MODEL.weights[6] * PU;
  prediction += COMBINED_MODEL.weights[7] * ATT;
  
  return Math.max(1, Math.min(5, prediction)); // Ensure prediction is between 1-5
};

// Feature Importance Chart component
const FeatureImportanceChart = ({ data }) => {
  // Sort data by importance in descending order
  const sortedData = [...data].sort((a, b) => b.importance - a.importance);
  
  return (
    <div className="feature-chart">
      {sortedData.map((feature, index) => (
        <div key={index} className="feature-item">
          <div className="feature-header">
            <span className="feature-name">{feature.name}</span>
            <span className="feature-value">{feature.importance.toFixed(2)}%</span>
          </div>
          <div className="feature-bar-bg">
            <div 
              className={`feature-bar ${feature.weight >= 0 ? 'positive' : 'negative'}`}
              style={{ width: `${feature.importance}%` }}
            ></div>
          </div>
          <div className="feature-weight">
            Weight: {feature.weight.toFixed(4)} {feature.weight >= 0 ? '(positive impact)' : '(negative impact)'}
          </div>
        </div>
      ))}
    </div>
  );
};

// Model Performance Comparison component
const ModelPerformanceComparison = ({ performance }) => {
  return (
    <div className="performance-section">
      <h3 className="section-subtitle">Model Performance Comparison</h3>
      <div className="table-container">
        <table className="performance-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Training R²</th>
              <th>Testing R²</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Linear Regression</td>
              <td>{performance.linearRegression.trainR2.toFixed(4)}</td>
              <td>{performance.linearRegression.testR2.toFixed(4)}</td>
            </tr>
            <tr>
              <td>Decision Tree</td>
              <td>{performance.decisionTree.trainR2.toFixed(4)}</td>
              <td>{performance.decisionTree.testR2.toFixed(4)}</td>
            </tr>
            <tr>
              <td>Combined Model</td>
              <td>{performance.combinedModel.trainR2.toFixed(4)}</td>
              <td>{performance.combinedModel.testR2.toFixed(4)}</td>
            </tr>
            <tr>
              <td>Random Forest</td>
              <td>{performance.randomForest.trainR2.toFixed(4)}</td>
              <td>{performance.randomForest.testR2.toFixed(4)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="performance-note">
        R² (coefficient of determination) measures how well the model predicts the target variable.
        Higher values indicate better predictive performance.
      </p>
    </div>
  );
};

// Floating Prediction Result component
const FloatingPrediction = ({ prediction, interpretation, isDragging, position, handleMouseDown }) => {
  return (
    <div 
      className="floating-prediction"
      style={{ 
        top: `${position.y}px`, 
        left: `${position.x}px`
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="prediction-header">
        <h4>Prediction Result</h4>
      </div>
      <div className={`prediction-value ${interpretation.colorClass}`}>
        Blockchain Adoption Intention: {interpretation.level} ({prediction.toFixed(2)}/5)
      </div>
      <p className="prediction-description">{interpretation.description}</p>
    </div>
  );
};

// Main prediction tool component
const MachineLearningPredictionTool = () => {
  // Initial state for input variables
  const [inputs, setInputs] = useState({
    CPT: 3, // Compatibility
    RAD: 3, // Relative Advantage
    CPX: 3, // Complexity
    SN: 3,  // Subjective Norms
    PBC: 3, // Perceived Behavioral Control
    PEOU: 3, // Perceived Ease of Use
    PU: 3,   // Perceived Usefulness
    ATT: 3   // Attitude
  });
  
  const [modelType, setModelType] = useState('basic'); // 'basic' or 'combined'
  
  // Floating prediction result state
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: 100 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // Handle drag start for prediction result box
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // Handle dragging
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
    }
  };

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Add event listeners for drag functionality
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  // Calculate prediction
  const prediction = modelType === 'basic' 
    ? predictBI(inputs) 
    : predictBICombined(inputs);
  
  // Interpret the prediction
  const interpretPrediction = (score) => {
    if (score >= 4.2) return { level: "Very High", colorClass: "very-high", description: "Organization is very likely to adopt blockchain technology" };
    if (score >= 3.4) return { level: "High", colorClass: "high", description: "Organization is likely to adopt blockchain technology" };
    if (score >= 2.6) return { level: "Moderate", colorClass: "moderate", description: "Organization is moderately likely to adopt blockchain technology" };
    if (score >= 1.8) return { level: "Low", colorClass: "low", description: "Organization is unlikely to adopt blockchain technology" };
    return { level: "Very Low", colorClass: "very-low", description: "Organization is very unlikely to adopt blockchain technology" };
  };
  
  const predictionInterpretation = interpretPrediction(prediction);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };
  
  return (
    <div className="prediction-tool">
      <h2 className="section-title">Machine Learning Prediction Tool</h2>
      <p className="tool-description">
        This tool uses machine learning models trained on survey data to predict blockchain adoption intention.
      </p>
      
      <div className="model-selector">
        <label className="selector-label">Model Type:</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="modelType"
              value="basic"
              checked={modelType === 'basic'}
              onChange={() => setModelType('basic')}
              className="radio-input"
            />
            <span>Basic Model (Primary Factors)</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="modelType"
              value="combined"
              checked={modelType === 'combined'}
              onChange={() => setModelType('combined')}
              className="radio-input"
            />
            <span>Combined Model (All Factors)</span>
          </label>
        </div>
      </div>
      
      <div className="factors-grid">
        <div className="primary-factors">
          <h3 className="factors-title">Primary Input Factors</h3>
          
          {/* Improved slider with proper label positioning */}
          <div className="slider-container">
            <label className="slider-label">Compatibility (CPT)</label>
            <div className="slider-wrapper">
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                name="CPT"
                value={inputs.CPT}
                onChange={handleInputChange}
                className="slider"
              />
              <div className="slider-labels">
                <span className="low-label">Low (1)</span>
                <span className="high-label">High (5)</span>
              </div>
            </div>
            <p className="slider-description">How compatible blockchain is with existing systems</p>
          </div>

          <div className="slider-container">
            <label className="slider-label">Relative Advantage (RAD)</label>
            <div className="slider-wrapper">
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                name="RAD"
                value={inputs.RAD}
                onChange={handleInputChange}
                className="slider"
              />
              <div className="slider-labels">
                <span className="low-label">Low (1)</span>
                <span className="high-label">High (5)</span>
              </div>
            </div>
            <p className="slider-description">Perceived benefits of blockchain over existing systems</p>
          </div>

          <div className="slider-container">
            <label className="slider-label">Complexity (CPX)</label>
            <div className="slider-wrapper">
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                name="CPX"
                value={inputs.CPX}
                onChange={handleInputChange}
                className="slider"
              />
              <div className="slider-labels">
                <span className="low-label">Low (1)</span>
                <span className="high-label">High (5)</span>
              </div>
            </div>
            <p className="slider-description">Perceived difficulty in understanding and using blockchain</p>
          </div>

          <div className="slider-container">
            <label className="slider-label">Subjective Norms (SN)</label>
            <div className="slider-wrapper">
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                name="SN"
                value={inputs.SN}
                onChange={handleInputChange}
                className="slider"
              />
              <div className="slider-labels">
                <span className="low-label">Low (1)</span>
                <span className="high-label">High (5)</span>
              </div>
            </div>
            <p className="slider-description">Social influence from peers and industry</p>
          </div>

          <div className="slider-container">
            <label className="slider-label">Perceived Behavioral Control (PBC)</label>
            <div className="slider-wrapper">
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                name="PBC"
                value={inputs.PBC}
                onChange={handleInputChange}
                className="slider"
              />
              <div className="slider-labels">
                <span className="low-label">Low (1)</span>
                <span className="high-label">High (5)</span>
              </div>
            </div>
            <p className="slider-description">Perceived control over adopting blockchain</p>
          </div>
        </div>
        
        {modelType === 'combined' && (
          <div className="secondary-factors">
            <h3 className="factors-title">Secondary Input Factors</h3>
            
            <div className="slider-container">
              <label className="slider-label">Perceived Ease of Use (PEOU)</label>
              <div className="slider-wrapper">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  name="PEOU"
                  value={inputs.PEOU}
                  onChange={handleInputChange}
                  className="slider"
                />
                <div className="slider-labels">
                  <span className="low-label">Low (1)</span>
                  <span className="high-label">High (5)</span>
                </div>
              </div>
            </div>
            
            <div className="slider-container">
              <label className="slider-label">Perceived Usefulness (PU)</label>
              <div className="slider-wrapper">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  name="PU"
                  value={inputs.PU}
                  onChange={handleInputChange}
                  className="slider"
                />
                <div className="slider-labels">
                  <span className="low-label">Low (1)</span>
                  <span className="high-label">High (5)</span>
                </div>
              </div>
            </div>
            
            <div className="slider-container">
              <label className="slider-label">Attitude (ATT)</label>
              <div className="slider-wrapper">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  name="ATT"
                  value={inputs.ATT}
                  onChange={handleInputChange}
                  className="slider"
                />
                <div className="slider-labels">
                  <span className="low-label">Low (1)</span>
                  <span className="high-label">High (5)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="feature-importance-section">
        <h3 className="section-subtitle">Feature Importance</h3>
        <p className="feature-description">
          Feature importance shows how strongly each factor influences the prediction.
          Larger values indicate stronger influence.
        </p>
        
        <FeatureImportanceChart data={modelType === 'basic' ? FEATURE_IMPORTANCE : COMBINED_FEATURE_IMPORTANCE} />
      </div>
      
      <ModelPerformanceComparison performance={MODEL_PERFORMANCE} />
      
      {/* Floating prediction result */}
      <FloatingPrediction 
        prediction={prediction}
        interpretation={predictionInterpretation}
        isDragging={isDragging}
        position={position}
        handleMouseDown={handleMouseDown}
      />
    </div>
  );
};

const BlockchainMLModel = () => {
  return (
    <div className="blockchain-container">
      <h1 className="page-title">Machine Learning Model for Blockchain Adoption</h1>
      
      <div className="overview-section">
        <h2 className="section-title">Model Overview</h2>
        <p className="overview-text">
          This machine learning model predicts the likelihood of blockchain adoption in the palm oil industry
          based on survey data from industry professionals. Two models have been developed:
        </p>
        <ul className="overview-list">
          <li>
            <span className="highlight">Basic Model:</span> Uses only the primary factors (CPT, RAD, CPX, SN, PBC)
            to predict adoption intention directly.
          </li>
          <li>
            <span className="highlight">Combined Model:</span> Incorporates both primary factors and intermediate
            constructs (PEOU, PU, ATT) for more nuanced predictions.
          </li>
        </ul>
        <p className="overview-text">
          Both models have been trained and tested on real survey data, with the combined model achieving
          the highest predictive accuracy (R² = 0.66 on test data).
        </p>
      </div>
      
      <MachineLearningPredictionTool />
      
      <div className="findings-section">
        <h2 className="section-title">Key Findings from Machine Learning Analysis</h2>
        
        <div className="finding-group">
          <h3 className="finding-title">1. Most Influential Factors:</h3>
          <ul className="finding-list">
            <li>Subjective Norms (34.8%) - Social influence has the strongest impact</li>
            <li>Perceived Behavioral Control (27.0%) - Resources and capabilities greatly affect adoption</li>
            <li>Compatibility (22.5%) - Alignment with existing systems is critical</li>
          </ul>
        </div>
        
        <div className="finding-group">
          <h3 className="finding-title">2. Negative Impact Factors:</h3>
          <ul className="finding-list">
            <li>Complexity (-10.7%) - Higher perceived complexity reduces adoption intention</li>
            <li>Relative Advantage (-8.8%) - Surprisingly, higher perceived advantages correlate with lower adoption intention, suggesting potential challenges in implementation</li>
          </ul>
        </div>
        
        <div className="finding-group">
          <h3 className="finding-title">3. Model Performance:</h3>
          <p className="finding-text">The combined model incorporating intermediate TAM constructs performed best (R² = 0.66),
          indicating that blockchain adoption is influenced by both external factors and internal
          perceptions of usefulness and ease of use.</p>
        </div>
      </div>
    </div>
  );
};

export default BlockchainMLModel;