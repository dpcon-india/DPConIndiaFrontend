const disableInspect = () => {
    // Disable right-click
    document.addEventListener('contextmenu', (event) => event.preventDefault());
  
 
    document.addEventListener('keydown', (event) => {
      if (
        event.key === 'F12' ||
        (event.ctrlKey && event.shiftKey && event.key === 'I') || 
        (event.ctrlKey && event.shiftKey && event.key === 'J') || 
        (event.ctrlKey && event.key === 'U') 
      ) {
        event.preventDefault();
      }
    });
  
    // Block console access completely
    (function () {
      const originalConsole = console;
      Object.defineProperty(window, 'console', {
        get() {
          return originalConsole;
        },
        set() {
          throw new Error("Console access is disabled.");
        }
      });
    })();
  
    // Detect DevTools and refresh the page
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
        window.location.reload(); // Refresh if DevTools is detected
      }
    }, 1000);
  
    // Trap debugger (Prevents breakpoints)
    setInterval(() => {
      function detectDebugger() {
        if (typeof window !== 'undefined') {
          (function () {
            function log() {
              console.clear();
              console.log('%c STOP! ', 'font-size: 50px; color: red; font-weight: bold; background: black;');
              console.log('%c DevTools detection is enabled.', 'font-size: 20px; color: white; background: black;');
            }
  
            setInterval(log, 1000);
          })();
        }
      }
      detectDebugger();
    }, 1000);
  
    // Prevent opening DevTools using mouse right-click
    document.addEventListener('mousedown', function (event) {
      if (event.button === 2 || event.button === 1) { // Right & Middle Mouse Button
        event.preventDefault();
      }
    });
  
    // Prevent opening DevTools through drag
    document.addEventListener('dragstart', (event) => {
      event.preventDefault();
    });
  
    // Block certain keypresses that can open DevTools
    document.addEventListener('keydown', function (event) {
      if (
        event.ctrlKey && event.key === 's' ||  // Prevent Ctrl+S (Save As)
        event.ctrlKey && event.key === 'c' ||  // Prevent Ctrl+C (Copy)
        event.ctrlKey && event.key === 'x' ||  // Prevent Ctrl+X (Cut)
        event.ctrlKey && event.key === 'v' ||  // Prevent Ctrl+V (Paste)
        event.ctrlKey && event.key === 'a' ||  // Prevent Ctrl+A (Select All)
        event.ctrlKey && event.key === 'p'     // Prevent Ctrl+P (Print)
      ) {
        event.preventDefault();
      }
    });
  
    // Disable Developer Tools Detection Using Chrome Hack
    setInterval(() => {
      const before = new Date().getTime();
      
      // eslint-disable-next-line no-debugger
      debugger;
      
      const after = new Date().getTime();
      if (after - before > 200) {
        window.location.reload(); // Force reload if debugger is detected
      }
    }, 1000);
  };
  
  export default disableInspect;
  