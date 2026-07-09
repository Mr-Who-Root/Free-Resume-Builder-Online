/**
 * Prints the resume element directly by writing it to a temporary hidden iframe.
 * This guarantees sharp, selectable vector text and respects multi-page breaks.
 */
export const downloadPdf = (resumeElementId: string, filename: string, pageSize: 'letter' | 'a4' = 'letter'): void => {
  const element = document.getElementById(resumeElementId);
  if (!element) {
    console.error("Resume element not found: " + resumeElementId);
    return;
  }

  // Create temporary hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  iframe.style.top = '-9999px';
  iframe.style.left = '-9999px';
  
  document.body.appendChild(iframe);
  
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    console.error("Could not access iframe document");
    return;
  }

  // Copy stylesheets and fonts from main document
  const headElements = document.querySelectorAll('style, link[rel="stylesheet"]');
  headElements.forEach(el => {
    iframeDoc.head.appendChild(el.cloneNode(true));
  });

  const pageWidth = pageSize === 'letter' ? '816px' : '794px';

  // Ensure high quality print styles and page settings are applied
  const printStyle = iframeDoc.createElement('style');
  printStyle.textContent = `
    @page {
      margin: 0;
      size: ${pageSize === 'letter' ? 'letter' : 'A4'};
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      color: black !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    .print-container {
      width: ${pageWidth} !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    /* Ensure the inner paper has no shadows or outer margins when printing */
    .resume-paper {
      box-shadow: none !important;
      border: none !important;
      margin: 0 !important;
      width: 100% !important;
      min-height: 0 !important;
    }

    /* Print-specific layout fixes */
    .print-hide {
      display: none !important;
    }
  `;
  iframeDoc.head.appendChild(printStyle);

  // Set the document title which browser uses as the default PDF filename
  iframeDoc.title = filename.replace(/\.pdf$/i, '');

  // Wrap element content
  iframeDoc.body.innerHTML = `
    <div class="print-container">
      ${element.innerHTML}
    </div>
  `;

  // Wait for assets/fonts to load, then print
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error("Iframe printing failed:", e);
    } finally {
      // Remove iframe after print dialog completes
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 500);
    }
  }, 600);
};
