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
  const styleLoadPromises: Promise<any>[] = [];

  headElements.forEach(el => {
    const clonedNode = el.cloneNode(true);
    iframeDoc.head.appendChild(clonedNode);

    // If it's an external link stylesheet, monitor its load event to prevent race conditions
    if (el.tagName.toLowerCase() === 'link' && el.getAttribute('rel') === 'stylesheet') {
      const loadPromise = new Promise((resolve) => {
        clonedNode.addEventListener('load', resolve);
        clonedNode.addEventListener('error', resolve); // Proceed anyway on error
        
        // Safety check if already loaded
        if ((clonedNode as any).sheet) {
          resolve(true);
        }
        
        // Timeout safeguard
        setTimeout(resolve, 2000);
      });
      styleLoadPromises.push(loadPromise);
    }
  });

  const pageWidth = pageSize === 'letter' ? '816px' : '794px';

  // Ensure high quality print styles and page settings are applied
  const printStyle = iframeDoc.createElement('style');
  printStyle.textContent = `
    @page {
      margin: 15mm 15mm 15mm 15mm;
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
      padding: 0 !important;
    }

    /* Print-specific layout fixes */
    .print-hide {
      display: none !important;
    }

    /* Avoid cutting off data blocks horizontally in the middle of a page break */
    .experience-item, 
    .education-item, 
    .project-item, 
    .custom-item,
    .skills-category-item {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    /* Prevent orphan headings from splitting onto separate pages from their content */
    h2 {
      page-break-after: avoid !important;
      break-after: avoid !important;
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

  // Asynchronously trigger printing when all styles and fonts are fully resolved
  const executePrint = async () => {
    try {
      // 1. Wait for link stylesheets to resolve
      await Promise.all(styleLoadPromises);

      // 2. Wait for fonts to be ready inside the iframe contexts
      if ((iframeDoc as any).fonts) {
        await (iframeDoc as any).fonts.ready;
      }

      // 3. Brief layout settle buffer
      await new Promise(resolve => setTimeout(resolve, 350));

      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error("Iframe printing failed:", e);
    } finally {
      // Clean up iframe helper element
      setTimeout(() => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    }
  };

  executePrint();
};
