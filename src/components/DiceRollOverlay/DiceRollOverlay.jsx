import React, { useState, useRef, useEffect } from 'react';
import './DiceRollOverlay.css';

const DiceRollOverlay = ({ isOpen, onClose }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [diceInput, setDiceInput] = useState('');
  const [diceCounts, setDiceCounts] = useState({ d6: 0, d20: 0 });
  const [rollResult, setRollResult] = useState(null);
  const overlayRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('dice-overlay-header')) {
      setIsDragging(true);
      const rect = overlayRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const addDie = (type) => {
    setDiceCounts(prev => {
      const newCounts = { ...prev, [type]: prev[type] + 1 };
      
      // If input is empty, just add the new die
      if (!diceInput.trim()) {
        setDiceInput(`1${type}`);
        return newCounts;
      }
      
      // Preserve the existing expression structure
      const parts = diceInput.split(/[+\-]/).map(part => part.trim());
      const operators = diceInput.match(/[+\-]/g) || [];
      let newExpression = '';
      let foundType = false;
      
      // Rebuild the expression with updated dice counts
      parts.forEach((part, index) => {
        if (part.includes('d')) {
          const [num, sides] = part.split('d');
          if (sides === type.slice(1)) { // If this is the type we're adding
            // Keep the original operator but update the count
            const operator = index > 0 ? operators[index - 1] : '';
            const newCount = parseInt(num) + 1;
            newExpression += (index > 0 ? ` ${operator} ` : '') + `${newCount}${type}`;
            foundType = true;
          } else if (sides === '6') {
            // Keep the original operator and count
            const operator = index > 0 ? operators[index - 1] : '';
            newExpression += (index > 0 ? ` ${operator} ` : '') + `${num}d6`;
          } else if (sides === '20') {
            // Keep the original operator and count
            const operator = index > 0 ? operators[index - 1] : '';
            newExpression += (index > 0 ? ` ${operator} ` : '') + `${num}d20`;
          } else {
            // Preserve other dice types with their original operator
            const operator = index > 0 ? operators[index - 1] : '';
            newExpression += (index > 0 ? ` ${operator} ` : '') + part;
          }
        } else if (part) {
          // Preserve modifiers
          const operator = index > 0 ? operators[index - 1] : '';
          // Only add the operator if it's not the first element or if it's negative
          if (index > 0 || operator === '-') {
            newExpression += ` ${operator} ${part}`;
          } else {
            newExpression += part;
          }
        }
      });

      // If we didn't find the type in the expression, add it at the end
      if (!foundType) {
        newExpression += (newExpression ? ' + ' : '') + `1${type}`;
      }

      setDiceInput(newExpression.trim());
      return newCounts;
    });
  };

  const handleInputChange = (e) => {
    const newInput = e.target.value;
    setDiceInput(newInput);
    
    // Reset dice counts when input is cleared
    if (!newInput.trim()) {
      setDiceCounts({ d6: 0, d20: 0 });
      return;
    }

    // Parse the input to update dice counts
    const parts = newInput.split(/[+\-]/).map(part => part.trim());
    const operators = newInput.match(/[+\-]/g) || [];
    const newCounts = { d6: 0, d20: 0 };

    parts.forEach((part, index) => {
      if (part.includes('d6')) {
        const count = parseInt(part) || 1;
        // Check if this roll should be subtracted
        const isSubtraction = index > 0 && operators[index - 1] === '-';
        newCounts.d6 += isSubtraction ? -count : count;
      } else if (part.includes('d20')) {
        const count = parseInt(part) || 1;
        // Check if this roll should be subtracted
        const isSubtraction = index > 0 && operators[index - 1] === '-';
        newCounts.d20 += isSubtraction ? -count : count;
      }
    });

    setDiceCounts(newCounts);
  };

  const rollDice = () => {
    if (!diceInput.trim()) return;

    const parts = diceInput.split(/[+\-]/).map(part => part.trim());
    const operators = diceInput.match(/[+\-]/g) || [];
    const results = [];
    let total = 0;

    parts.forEach((part, index) => {
      if (part.includes('d')) {
        // Handle dice rolls
        const [num, sides] = part.split('d').map(n => parseInt(n));
        const rolls = [];
        let rollTotal = 0;
        for (let i = 0; i < num; i++) {
          const roll = Math.floor(Math.random() * sides) + 1;
          rolls.push(roll);
          rollTotal += roll;
        }
        // Check if this roll should be subtracted
        const isSubtraction = index > 0 && operators[index - 1] === '-';
        const adjustedTotal = isSubtraction ? -rollTotal : rollTotal;
        total += adjustedTotal;
        results.push(`${isSubtraction ? '-' : ''}${part}: [${rolls.join(', ')}] = ${adjustedTotal}`);
      } else if (part) {
        // Handle modifiers
        const modifier = parseInt(part);
        if (!isNaN(modifier)) {
          // Check if this modifier should be subtracted
          const isSubtraction = index > 0 && operators[index - 1] === '-';
          const adjustedModifier = isSubtraction ? -modifier : modifier;
          total += adjustedModifier;
          results.push(`Modifier: ${adjustedModifier}`);
        }
      }
    });

    setRollResult({
      details: results.join('\n'),
      total: total
    });
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  return (
    <div 
      className="dice-overlay"
      ref={overlayRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="dice-overlay-header">
        <span>Dice Roll</span>
        <button className="dice-overlay-close-button" onClick={onClose}>×</button>
      </div>
      <div className="dice-overlay-content">
        <div className="dice-overlay-buttons">
          <button onClick={() => addDie('d6')}>d6</button>
          <button onClick={() => addDie('d20')}>d20</button>
        </div>
        <div className="dice-overlay-input">
          <input
            type="text"
            value={diceInput}
            onChange={handleInputChange}
            placeholder="e.g., 2d6 + 1d20 + 5"
          />
          <button onClick={rollDice}>Throw</button>
        </div>
        {rollResult && (
          <div className="dice-overlay-result">
            <h3>Roll Results:</h3>
            <pre>{rollResult.details}</pre>
            <div className="total">Total: {rollResult.total}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiceRollOverlay; 