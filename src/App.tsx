import { useState, useEffect } from 'react';
import type { ResumeData } from './types/resume';
import { loadResumeData, saveResumeData } from './utils/storage';
import { Layout } from './components/Layout';

function App() {
  // Load data from LocalStorage or fallback to beautiful developer template data
  const [resumeData, setResumeData] = useState<ResumeData>(() => loadResumeData());

  // Auto-save changes to localStorage in real-time
  useEffect(() => {
    saveResumeData(resumeData);
  }, [resumeData]);

  return (
    <Layout 
      data={resumeData} 
      onChange={setResumeData} 
    />
  );
}

export default App;
