/**
 * Exports the resume content as an MS Word compatible .doc file by wrapping
 * the rendered HTML in standard Office HTML MIME formats.
 */
export const downloadDoc = (resumeElementId: string, filename: string): void => {
  const element = document.getElementById(resumeElementId);
  if (!element) {
    console.error("Resume element not found for DOC export: " + resumeElementId);
    return;
  }

  // Clone elements and clean up print-hidden assets
  const clone = element.cloneNode(true) as HTMLElement;
  const hiddens = clone.querySelectorAll('.print-hide');
  hiddens.forEach(el => el.parentNode?.removeChild(el));

  // Extract classes/styles or translate them to standard inline blocks for Word
  const htmlContent = clone.innerHTML;

  const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' 
        xmlns:w='urn:schemas-microsoft-com:office:word' 
        xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>${filename}</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
              <w:DoNotOptimizeForBrowser/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            /* General styling mapped from our typography for Microsoft Word import */
            body {
              font-family: 'Arial', 'Helvetica', sans-serif;
              font-size: 10.5pt;
              line-height: 1.25;
              color: #2D3748;
            }
            h1 {
              font-family: 'Arial', sans-serif;
              font-size: 20pt;
              font-weight: bold;
              margin-bottom: 2pt;
              text-align: center;
            }
            .subtitle {
              text-align: center;
              font-size: 9.5pt;
              margin-bottom: 12pt;
              color: #4A5568;
            }
            h2 {
              font-family: 'Arial', sans-serif;
              font-size: 12pt;
              font-weight: bold;
              border-bottom: 1px solid #CBD5E0;
              margin-top: 14pt;
              margin-bottom: 6pt;
              text-transform: uppercase;
              color: #1A365D;
            }
            .section-row {
              margin-bottom: 8pt;
            }
            .entry-header {
              font-weight: bold;
              font-size: 11pt;
            }
            .entry-sub {
              font-style: italic;
              color: #4A5568;
              margin-bottom: 4pt;
            }
            .entry-meta {
              text-align: right;
              font-size: 9.5pt;
              color: #718096;
            }
            ul {
              margin: 4pt 0 4pt 15pt;
              padding: 0;
            }
            li {
              margin-bottom: 3pt;
            }
            .skills-grid {
              margin-bottom: 6pt;
            }
            .skills-category {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>`;

  const blob = new Blob(['\ufeff' + header], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
