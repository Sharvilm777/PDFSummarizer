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

  // Calculate similarity between two strings (0 to 1)
  const calculateSimilarity = (str1, str2) => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const distance = matrix[len1][len2];
    const maxLength = Math.max(len1, len2);
    return 1 - distance / maxLength;
  };

  // Function to find the bounding box for a given text match
  const findTextPositions = (pageTextItems, searchText, scaleFactor) => {
    if (!searchText || !pageTextItems || pageTextItems.length === 0) {
      console.log('⚠️ Invalid input:', { searchText, pageItemsLength: pageTextItems?.length });
      return [];
    }

    // Normalize search text
    const normalizedSearch = searchText.toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/['']/g, "'")
      .replace(/[""]/g, '"')
      .replace(/[‒–—―]/g, '-');

    const SIMILARITY_THRESHOLD = 0.8; // 80% similarity threshold
    const matches = [];
    console.log('🔍 Normalized search text:', normalizedSearch);

    // Create an array of text items with their positions
    let currentY = null;
    let lineTexts = [];
    let currentLine = [];
    
    // Group text items by lines with tolerance
    pageTextItems.forEach((item, index) => {
      if (!item.str.trim()) return;

      if (currentY === null) {
        currentY = item.transform[5];
      }

      const yDiff = Math.abs(item.transform[5] - currentY);
      if (yDiff < 3) {
        currentLine.push(item);
      } else {
        if (currentLine.length > 0) {
          lineTexts.push(currentLine);
        }
        currentLine = [item];
        currentY = item.transform[5];
      }
      
      if (index === pageTextItems.length - 1 && currentLine.length > 0) {
        lineTexts.push(currentLine);
      }
    });

    // Process each line
    lineTexts.forEach(line => {
      line.sort((a, b) => a.transform[4] - b.transform[4]);

      // Create sliding windows of text to check for matches
      const lineText = line.map(item => item.str).join('');
      const normalizedLineText = lineText.toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/['']/g, "'")
        .replace(/[""]/g, '"')
        .replace(/[‒–—―]/g, '-');

      const searchLength = normalizedSearch.length;
      const windowSize = Math.floor(searchLength * 1.5); // Allow for some extra characters

      for (let i = 0; i < normalizedLineText.length - searchLength + 1; i++) {
        // Check windows of text around this position
        for (let size = searchLength - 2; size <= windowSize; size++) {
          if (i + size > normalizedLineText.length) break;
          
          const windowText = normalizedLineText.substr(i, size);
          const similarity = calculateSimilarity(normalizedSearch, windowText);

          if (similarity >= SIMILARITY_THRESHOLD) {
            console.log(`Found match with ${(similarity * 100).toFixed(1)}% similarity:`, windowText);

            // Find the corresponding text items
            let charCount = 0;
            let startItem = null;
            let endItem = null;
            let startOffset = 0;
            let endOffset = 0;

            for (let j = 0; j < line.length; j++) {
              const item = line[j];
              const prevCharCount = charCount;
              charCount += item.str.length;

              if (!startItem && i < charCount) {
                startItem = item;
                startOffset = i - prevCharCount;
              }

              if (startItem && (i + size) <= charCount) {
                endItem = item;
                endOffset = Math.min(item.str.length, i + size - prevCharCount);
                break;
              }
            }

            if (startItem && endItem) {
              const startX = startItem.transform[4] + (startOffset * (startItem.width || 0) / startItem.str.length);
              const endX = endItem === startItem 
                ? startItem.transform[4] + (endOffset * (startItem.width || 0) / startItem.str.length)
                : endItem.transform[4] + (endOffset * (endItem.width || 0) / endItem.str.length);

              matches.push({
                text: windowText,
                similarity: similarity,
                transform: [0, 0, 0, 0, startX * scaleFactor, startItem.transform[5] * scaleFactor],
                width: Math.max((endX - startX) * scaleFactor, 5),
                height: Math.abs(startItem.height || 0) * scaleFactor
              });
            }

            // Skip to end of this match to avoid overlapping matches
            i += size - 1;
            break;
          }
        }
      }
    });

    // Remove overlapping matches, keeping the ones with higher similarity
    const filteredMatches = matches.sort((a, b) => b.similarity - a.similarity)
      .filter((match, index, arr) => {
        for (let i = 0; i < index; i++) {
          const prev = arr[i];
          const overlap = !(
            match.transform[4] > prev.transform[4] + prev.width ||
            match.transform[4] + match.width < prev.transform[4]
          );
          if (overlap) return false;
        }
        return true;
      });

    console.log(`\n🔎 Total matches found: ${filteredMatches.length}`);
    return filteredMatches;
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
