import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

class EditorErrorBoundary extends React.Component<React.PropsWithChildren, {failed: boolean}> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Verbum editor failed to render', error, info.componentStack);
  }
  render() {
    if (this.state.failed) return <main style={{fontFamily:'Segoe UI,Arial,sans-serif',padding:'40px',maxWidth:680,margin:'auto',color:'#263448'}}><h1>Verbum could not load</h1><p>The editor encountered an unexpected error. Your locally saved documents have not been changed.</p><button onClick={() => window.location.reload()} style={{padding:'10px 18px',cursor:'pointer'}}>Reload editor</button><p style={{fontSize:13,color:'#66758a'}}>If the problem persists, report the browser console error from F12 → Console.</p></main>;
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><EditorErrorBoundary><App /></EditorErrorBoundary></React.StrictMode>);
