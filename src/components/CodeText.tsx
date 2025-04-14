import React from 'react';

interface CodeTextProps {
  text: string;
}

const CodeText: React.FC<CodeTextProps> = ({ text }) => {
  // Display the text as-is, without any interpretation of escape sequences
  return <span className="font-mono">{text}</span>;
};

export default CodeText;
