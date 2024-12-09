import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';

// Ensure PDF.js worker is loaded
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ 
  pdfFile, 
  isPdfVisible, 
  isDarkMode, 
  setNumPages,
  highlights
}) => {
  const [numPages, setNumPagesState] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [localHighlights, setLocalHighlights] = useState({});
  const pageRef = useRef(null);
  const containerRef = useRef(null);
  const [pageScale, setPageScale] = useState(1);

  // Handle document load success
  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPagesState(numPages);
    setNumPages(numPages);
    setPageNumber(1);
  }, [setNumPages]);

  // Function to find the bounding box for a given text match
  const findTextPositions = (pageTextItems, searchText, scaleFactor) => {
    if (!searchText || !pageTextItems || pageTextItems.length === 0) {
      console.log('⚠️ Invalid input:', { searchText, pageItemsLength: pageTextItems?.length });
      return [];
    }

    // Normalize search text: remove extra spaces, normalize quotes and dashes
    const normalizedSearch = searchText.toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/['']/g, "'")
      .replace(/[""]/g, '"')
      .replace(/[‒–—―]/g, '-');

    const matches = [];
    console.log('🔍 Normalized search text:', normalizedSearch);

    // Create an array of text items with their positions
    let currentY = null;
    let lineTexts = [];
    let currentLine = [];
    
    // Group text items by lines with tolerance for slight y-coordinate differences
    pageTextItems.forEach((item, index) => {
      // Skip empty or whitespace-only items
      if (!item.str.trim()) return;

      // Initialize currentY if not set
      if (currentY === null) {
        currentY = item.transform[5];
      }

      // Check if item is on the same line (with tolerance)
      const yDiff = Math.abs(item.transform[5] - currentY);
      if (yDiff < 3) { // Increased tolerance for vertical alignment
        currentLine.push(item);
      } else {
        if (currentLine.length > 0) {
          lineTexts.push(currentLine);
        }
        currentLine = [item];
        currentY = item.transform[5];
      }
      
      // Handle last line
      if (index === pageTextItems.length - 1 && currentLine.length > 0) {
        lineTexts.push(currentLine);
      }
    });

    // Process each line
    lineTexts.forEach(line => {
      // Sort items by x-coordinate to ensure correct order
      line.sort((a, b) => a.transform[4] - b.transform[4]);

      // Combine text items with proper spacing
      const lineText = line.map(item => item.str).join('');
      const normalizedLineText = lineText.toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/['']/g, "'")
        .replace(/[""]/g, '"')
        .replace(/[‒–—―]/g, '-');

      let searchIndex = 0;
      while ((searchIndex = normalizedLineText.indexOf(normalizedSearch, searchIndex)) !== -1) {
        let charCount = 0;
        let startItem = null;
        let endItem = null;
        let startOffset = 0;
        let endOffset = 0;

        // Find the text items that contain the match
        for (let i = 0; i < line.length; i++) {
          const item = line[i];
          const prevCharCount = charCount;
          charCount += item.str.length;

          if (!startItem && searchIndex < charCount) {
            startItem = item;
            startOffset = searchIndex - prevCharCount;
          }

          if (startItem && (searchIndex + normalizedSearch.length) <= charCount) {
            endItem = item;
            endOffset = Math.min(item.str.length, searchIndex + normalizedSearch.length - prevCharCount);
            break;
          }
        }

        if (startItem && endItem) {
          // Calculate precise positions
          const startX = startItem.transform[4] + (startOffset * (startItem.width || 0) / startItem.str.length);
          const endX = endItem === startItem 
            ? startItem.transform[4] + (endOffset * (startItem.width || 0) / startItem.str.length)
            : endItem.transform[4] + (endOffset * (endItem.width || 0) / endItem.str.length);

          matches.push({
            text: normalizedSearch,
            transform: [0, 0, 0, 0, startX * scaleFactor, startItem.transform[5] * scaleFactor],
            width: Math.max((endX - startX) * scaleFactor, 5), // Ensure minimum width
            height: Math.abs(startItem.height || 0) * scaleFactor
          });
        }

        searchIndex += normalizedSearch.length;
      }
    });

    console.log(`\n🔎 Total matches found: ${matches.length}`);
    return matches;
  };

  // Calculate scale factor after page renders
  const onPageRenderSuccess = (pdfPage) => {
    if (pageRef.current && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const pageWidth = pdfPage.originalWidth;

      const scale = containerWidth / pageWidth;
      setPageScale(scale);
    }
  };

  // Prepare highlights when document is loaded or when highlights prop changes
  useEffect(() => {
    const prepareHighlights = async () => {
      if (!pdfFile) return;

      const preparedHighlights = {};

      for (let highlight of highlights) {
        try {
          const pdf = await pdfjs.getDocument(pdfFile).promise;
          const page = await pdf.getPage(parseInt(highlight.pageNumber));

          const textContent = await page.getTextContent();
          const textPositions = findTextPositions(textContent.items, highlight.text, pageScale);

          preparedHighlights[parseInt(highlight.pageNumber)] = {
            pageNumber:parseInt(highlight.pageNumber),
            matches: textPositions,
            color: highlight.color || 'yellow'
          };
        } catch (error) {
          console.error(`Error processing highlight for page ${highlight.pageNumber}:`, error);
        }
      }

      setLocalHighlights(preparedHighlights);
    };

    prepareHighlights();
  }, [pdfFile, highlights, pageScale]);

  return (
    <div 
      ref={containerRef}
      className={`${
        isPdfVisible ? "w-1/2 opacity-100" : "w-0 opacity-0"
      } transition-all duration-300 overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"} border-l ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
    >
      <div className={`h-full ${isDarkMode ? "bg-gray-700" : "bg-gray-50"} shadow-inner relative`}>
        <div className="absolute inset-0 overflow-auto">
          {pdfFile ? (
            <div>
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(error) => console.error('PDF load error:', error)}
              >
                <div ref={pageRef} className="relative">
                  <Page
                    pageNumber={pageNumber}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    width={600}
                    onRenderSuccess={onPageRenderSuccess}
                  />

                  {localHighlights[pageNumber] &&
                    localHighlights[pageNumber].matches.map((match, index) => (
                      <div
                        key={index}
                        className="absolute z-10 pointer-events-none"
                        style={{
                          left: `${match.transform[4]}px`,
                          top: `${match.transform[5]-200}px`,
                          width: `${match.width}px`,
                          height: `20px`,
                          backgroundColor: 'rgba(255, 255, 0, 0.5)'
                        }}
                      />
                  ))}
                </div>
              </Document>

              <div className="flex justify-between p-2 bg-gray-100">
                <button 
                  onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                  disabled={pageNumber <= 1}
                  className="px-4 py-2 bg-blue-500 text-white disabled:opacity-50"
                >
                  Previous Page
                </button>
                <span>
                  Page {pageNumber} of {numPages}
                </span>
                <button 
                  onClick={() => setPageNumber(prev => numPages ? Math.min(numPages, prev + 1) : prev)}
                  disabled={pageNumber >= numPages}
                  className="px-4 py-2 bg-blue-500 text-white disabled:opacity-50"
                >
                  Next Page
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Upload a PDF to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
