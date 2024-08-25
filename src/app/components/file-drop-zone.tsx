import React, { DragEvent } from 'react';
import { getFileExtension } from '@/app/util';
import { useToast } from '@/app/components/ui/use-toast';

const FileDropZone = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLDivElement> & { onFileDrop: (files: FileList) => void, accept: string }
>(({ className,children,onFileDrop, accept,...props }, ref) => {

  const { toast } = useToast();

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleDragLeave = (event: DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const file = files[0];
    if(accept && !checkFileType(file.name, accept)) {
      toast({
        variant: 'destructive',
        title: 'File type not support.',
      });
      return;
    }
    onFileDrop(files);
  };

  return (
    <div
      ref={ref}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={className + "cursor-no-drop"}
      {...props}
    >
      {children}
    </div>
  );
})

FileDropZone.displayName = "CardTitle"

export default FileDropZone;

function checkFileType(filename: string, accept: string) {
  const allowTypes = accept.split(',').map(t => t.trim())
  const extName = '.' + getFileExtension(filename);
  for(let type of allowTypes) {
    if(type === extName) {
      return true;
    }
  }
  return false;
}