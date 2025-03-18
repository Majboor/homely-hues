import React from "react";
import { cn } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface MarkdownRendererProps {
  markdown: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown, className }) => {
  // Parse and convert markdown to HTML elements
  const renderMarkdown = () => {
    // Split content by lines for processing
    const lines = markdown.split("\n");
    const elements: JSX.Element[] = [];
    let tableRows: string[][] = [];
    let inTable = false;
    let tableHeaders: string[] = [];
    let listItems: JSX.Element[] = [];
    let inList = false;
    let listType: "ul" | "ol" = "ul";
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Handle headings
      if (line.startsWith("# ")) {
        if (inList) {
          // Close any open list before starting a new heading
          if (listType === "ul") {
            elements.push(<ul key={`ul-${i}`} className="list-disc pl-6 my-4">{listItems}</ul>);
          } else {
            elements.push(<ol key={`ol-${i}`} className="list-decimal pl-6 my-4">{listItems}</ol>);
          }
          listItems = [];
          inList = false;
        }
        
        elements.push(
          <h1 key={i} className="text-3xl font-bold mt-8 mb-4">{renderLinks(line.substring(2))}</h1>
        );
      } else if (line.startsWith("## ")) {
        if (inList) {
          // Close any open list before starting a new heading
          if (listType === "ul") {
            elements.push(<ul key={`ul-${i}`} className="list-disc pl-6 my-4">{listItems}</ul>);
          } else {
            elements.push(<ol key={`ol-${i}`} className="list-decimal pl-6 my-4">{listItems}</ol>);
          }
          listItems = [];
          inList = false;
        }
        
        elements.push(
          <h2 key={i} className="text-2xl font-semibold mt-6 mb-3">{renderLinks(line.substring(3))}</h2>
        );
      } else if (line.startsWith("### ")) {
        if (inList) {
          // Close any open list before starting a new heading
          if (listType === "ul") {
            elements.push(<ul key={`ul-${i}`} className="list-disc pl-6 my-4">{listItems}</ul>);
          } else {
            elements.push(<ol key={`ol-${i}`} className="list-decimal pl-6 my-4">{listItems}</ol>);
          }
          listItems = [];
          inList = false;
        }
        
        elements.push(
          <h3 key={i} className="text-xl font-medium mt-5 mb-2">{renderLinks(line.substring(4))}</h3>
        );
      } else if (line.startsWith("#### ")) {
        if (inList) {
          // Close any open list before starting a new heading
          if (listType === "ul") {
            elements.push(<ul key={`ul-${i}`} className="list-disc pl-6 my-4">{listItems}</ul>);
          } else {
            elements.push(<ol key={`ol-${i}`} className="list-decimal pl-6 my-4">{listItems}</ol>);
          }
          listItems = [];
          inList = false;
        }
        
        elements.push(
          <h4 key={i} className="text-lg font-medium mt-4 mb-2">{renderLinks(line.substring(5))}</h4>
        );
      } 
      // Handle table
      else if (line.startsWith("|") && line.endsWith("|")) {
        if (inList) {
          // Close any open list before starting a table
          if (listType === "ul") {
            elements.push(<ul key={`ul-${i}`} className="list-disc pl-6 my-4">{listItems}</ul>);
          } else {
            elements.push(<ol key={`ol-${i}`} className="list-decimal pl-6 my-4">{listItems}</ol>);
          }
          listItems = [];
          inList = false;
        }
        
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
            <div key={`table-${i}`} className="my-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {tableHeaders.map((header, idx) => (
                      <TableHead key={idx}>{renderLinks(header)}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableRows.map((row, rowIdx) => (
                    <TableRow key={rowIdx}>
                      {row.map((cell, cellIdx) => (
                        <TableCell key={cellIdx}>
                          {renderLinks(cell)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          );
          inTable = false;
          tableRows = [];
          tableHeaders = [];
        }
      }
      // Handle lists
      else if (line.startsWith("* ") || line.startsWith("- ")) {
        const content = line.substring(2);
        
        if (!inList || listType !== "ul") {
          // If we were in a different type of list, close it
          if (inList) {
            if (listType === "ol") {
              elements.push(<ol key={`ol-${i}`} className="list-decimal pl-6 my-4">{listItems}</ol>);
              listItems = [];
            }
          }
          inList = true;
          listType = "ul";
        }
        
        listItems.push(<li key={`li-${i}`}>{renderLinks(content)}</li>);
        
        // If next line is not a list item, render the list
        const nextLine = lines[i + 1]?.trim();
        if (!nextLine || 
            !(nextLine.startsWith("* ") || 
              nextLine.startsWith("- ") || 
              nextLine.startsWith("1. "))) {
          elements.push(<ul key={`ul-${i}`} className="list-disc pl-6 my-4">{listItems}</ul>);
          listItems = [];
          inList = false;
        }
      } else if (line.match(/^\d+\.\s/)) {
        const content = line.substring(line.indexOf('.') + 2);
        
        if (!inList || listType !== "ol") {
          // If we were in a different type of list, close it
          if (inList) {
            if (listType === "ul") {
              elements.push(<ul key={`ul-${i}`} className="list-disc pl-6 my-4">{listItems}</ul>);
              listItems = [];
            }
          }
          inList = true;
          listType = "ol";
        }
        
        listItems.push(<li key={`li-${i}`}>{renderLinks(content)}</li>);
        
        // If next line is not a list item, render the list
        const nextLine = lines[i + 1]?.trim();
        if (!nextLine || 
            !(nextLine.startsWith("* ") || 
              nextLine.startsWith("- ") || 
              nextLine.match(/^\d+\.\s/))) {
          elements.push(<ol key={`ol-${i}`} className="list-decimal pl-6 my-4">{listItems}</ol>);
          listItems = [];
          inList = false;
        }
      }
      // Handle paragraphs (non-empty lines that don't match other patterns)
      else if (line.length > 0) {
        if (inList) {
          // Close any open list before starting a paragraph
          if (listType === "ul") {
            elements.push(<ul key={`ul-${i}`} className="list-disc pl-6 my-4">{listItems}</ul>);
          } else {
            elements.push(<ol key={`ol-${i}`} className="list-decimal pl-6 my-4">{listItems}</ol>);
          }
          listItems = [];
          inList = false;
        }
        
        elements.push(
          <p key={i} className="my-4 text-gray-800">
            {renderLinks(line)}
          </p>
        );
      } else if (line.length === 0 && inList) {
        // Empty line and we're in a list - close the list
        if (listType === "ul") {
          elements.push(<ul key={`ul-${i}`} className="list-disc pl-6 my-4">{listItems}</ul>);
        } else {
          elements.push(<ol key={`ol-${i}`} className="list-decimal pl-6 my-4">{listItems}</ol>);
        }
        listItems = [];
        inList = false;
      }
    }
    
    // Close any remaining list at the end of the document
    if (inList) {
      if (listType === "ul") {
        elements.push(<ul key="final-ul" className="list-disc pl-6 my-4">{listItems}</ul>);
      } else {
        elements.push(<ol key="final-ol" className="list-decimal pl-6 my-4">{listItems}</ol>);
      }
    }
    
    return elements;
  };

  // Helper to convert URLs to actual links
  const renderLinks = (text: string): React.ReactNode => {
    // Match URLs that might be in parentheses (markdown style) or standalone
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
