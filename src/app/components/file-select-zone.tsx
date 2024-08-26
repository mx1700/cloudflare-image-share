import React, {ForwardedRef, useCallback, useEffect, useRef, useState} from "react";
import {useToast} from "@/app/components/ui/use-toast";
import FileDropZone from "@/app/components/file-drop-zone";
import {cn} from "@/app/lib/utils";
import {UploadIcon} from "@/app/components/icon/upload-icon";

export interface FileSelectZoneRef {
    openFileSelect: () => void;
}

const FileSelectZone = React.forwardRef(({disabled, onFileChange, className, file}: {
    disabled: boolean,
    onFileChange: (file: File) => void,
    className?: string,
    file: File | null
}, ref: ForwardedRef<FileSelectZoneRef>) => {
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const {toast} = useToast();

    const openFileSelect = () => {
        inputFileRef.current?.click()
    }

    React.useImperativeHandle(ref, () => ({
        openFileSelect
    }));

    useEffect(() => {
        setPreviewUrl('');
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [file, setPreviewUrl]);

    const fileChange = useCallback((file: File) => {
        if (disabled) {
            return;
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast({
                variant: 'destructive',
                title: 'File size exceeds 5MB.',
            });
            return;
        }
        onFileChange && onFileChange(file)
    }, [disabled, onFileChange, toast]);

    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            const items = event.clipboardData?.items;
            if (!items || items.length === 0) {
                return;
            }

            const item = items[0];
            if (item.kind !== 'file') {
                return;
            }

            const file = item.getAsFile();
            if (!file || (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/gif')) {
                toast({
                    variant: 'destructive',
                    title: 'Only JPG, PNG, and GIF images are supported.',
                });
                return;
            }
            fileChange(file);
        }

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [fileChange, toast]);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length) {
            const file = e.target.files![0];
            fileChange(file);
        }
    };

    const handleFileDrop = (files: FileList) => {
        fileChange(files[0]);
    };

    return (
        <FileDropZone
            className={cn(className, disabled ? ' opacity-50 pointer-events-none' : '')}
            onClick={openFileSelect}
            onFileDrop={handleFileDrop}
            aria-disabled={disabled}
            accept=".jpg,.jpeg,.png,.gif"
        >
            <input className="hidden" ref={inputFileRef} disabled={disabled} type="file" accept=".jpg,.jpeg,.png,.gif"
                   onChange={handleFileInputChange}/>
            {previewUrl ? (
                <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} className={'max-h-36 rounded'} alt="Preview"/>
                </div>
            ) : (
                <>
                    <UploadIcon className="w-8 h-8 text-muted-foreground"/>
                    <p className="mt-2 text-sm text-muted-foreground">Click to select files</p>
                </>
            )}

        </FileDropZone>
    )
})

FileSelectZone.displayName = 'FileSelectZone'

export { FileSelectZone };