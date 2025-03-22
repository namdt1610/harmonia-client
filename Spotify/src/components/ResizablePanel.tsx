"use client";

import { useState } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css"; // Import CSS quan trọng!

interface ResizablePanelProps {
      children: React.ReactNode;
      defaultWidth: number;
      minWidth?: number;
      maxWidth?: number;
      className?: string;
      onResize?: (width: number) => void;
}

export default function ResizablePanel({
      children,
      defaultWidth,
      minWidth = 200,
      maxWidth = 400,
      className = "relative flex-none",
      onResize,
}: ResizablePanelProps) {
      const [panelWidth, setPanelWidth] = useState(defaultWidth);

      return (
            <div className="flex h-full">
                  {/* Sidebar có thể kéo */}
                  <ResizableBox
                        width={panelWidth}
                        height={Infinity} // Quan trọng để nó fill chiều cao
                        axis="x"
                        minConstraints={[minWidth, Infinity]}
                        maxConstraints={[maxWidth, Infinity]}
                        resizeHandles={["e"]} // Chỉ cho phép kéo ngang (east - bên phải)
                        onResizeStop={(e, data) => {
                              setPanelWidth(data.size.width);
                              if (onResize) {
                                    onResize(data.size.width);
                              }
                        }}
                        handle={
                              <div className="absolute w-2 h-full right-0 top-0 bg-red-500 bg-opacity-50 hover:bg-opacity-80 cursor-col-resize z-20">
                                    <div className="h-full flex items-center justify-center cursor-col-resize">
                                    </div>
                              </div>
                        }
                        className="relative border-2 border-blue-500"
                  >
                        <div
                              style={{ width: "100%", height: "100vh", overflow: "hidden" }}
                              className={className}
                        >
                              {children}
                        </div>
                  </ResizableBox>
            </div>
      );
}
