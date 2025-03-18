import React from "react";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  markdown: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown, className }) => {
  // Clean up the markdown content
  const cleanedMarkdown = markdown
    .replace(/\\n/g, "\n") // Replace escaped newlines with actual newlines
    .trim();
  
  // Parse and convert markdown to HTML elements
  const renderMarkdown = () => {
    // Split content by lines for processing
    const lines = cleanedMarkdown.split("\n");
    const elements: JSX.Element[] = [];
    let tableRows: string[][] = [];
    let inTable = false;
    let tableHeaders: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Handle headings
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={i} className="text-3xl font-bold mt-8 mb-4">{line.substring(2)}</h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="text-2xl font-semibold mt-6 mb-3">{line.substring(3)}</h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="text-xl font-medium mt-5 mb-2">{line.substring(4)}</h3>
        );
      } else if (line.startsWith("#### ")) {
        elements.push(
          <h4 key={i} className="text-lg font-medium mt-4 mb-2">{line.substring(5)}</h4>
        );
      } 
      // Handle table
      else if (line.startsWith("|") && line.endsWith("|")) {
        if (!inTable) {
          inTable = true;
          // Parse table headers
          tableHeaders = line
            .split("|")
            .filter(cell => cell.trim() !== "")
            .map(cell => cell.trim());
        } else if (line.includes("---")) {
          // Skip separator line
          continue;
        } else {
          // Parse table row
          const rowCells = line
            .split("|")
            .filter(cell => cell.trim() !== "")
            .map(cell => cell.trim());
          
          tableRows.push(rowCells);
        }
        
        // If next line doesn't start with |, render the table
        if (!lines[i + 1]?.trim().startsWith("|") || i === lines.length - 1) {
          elements.push(
            <div key={i} className="my-6 overflow-x-auto">
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    {tableHeaders.map((header, idx) => (
                      <th key={idx} className="border px-4 py-2 text-left">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, rowIdx) => (
                    <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="border px-4 py-2">
                          {renderLinks(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          inTable = false;
          tableRows = [];
          tableHeaders = [];
        }
      }
      // Handle lists
      else if (line.startsWith("* ")) {
        elements.push(
          <ul key={i} className="list-disc pl-6 my-2">
            <li>{renderLinks(line.substring(2))}</li>
          </ul>
        );
      } else if (line.startsWith("1. ")) {
        elements.push(
          <ol key={i} className="list-decimal pl-6 my-2">
            <li>{renderLinks(line.substring(3))}</li>
          </ol>
        );
      }
      // Handle paragraphs (non-empty lines that don't match other patterns)
      else if (line.length > 0) {
        elements.push(
          <p key={i} className="my-4">
            {renderLinks(line)}
          </p>
        );
      }
    }
    
    return elements;
  };

  // Helper to convert URLs to actual links
  const renderLinks = (text: string): React.ReactNode => {
    // URL pattern that matches URLs starting with http or https
    const urlPattern = /(https?:\/\/[^\s)]+)/g;
    
    // Split by URL pattern
    const parts = text.split(urlPattern);
    
    return parts.map((part, index) => {
      // If the part matches the URL pattern, render as a link
      if (part.match(urlPattern)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {part}
          </a>
        );
      }
      
      // Otherwise render as text
      return part;
    });
  };

  return (
    <div className={cn("markdown-content", className)}>
      {renderMarkdown()}
    </div>
  );
};

export default MarkdownRenderer;
