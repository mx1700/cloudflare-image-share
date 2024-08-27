import React, {ForwardedRef, useCallback, useEffect, useRef, useState} from "react";
import FileDropZone from "@/app/components/file-drop-zone";
import {cn, formatFileSize} from "@/app/lib/utils";
import {UploadIcon} from "@/app/components/icon/upload-icon";

export interface FileSelectZoneRef {
    openFileSelect: () => void;
}

const FileSelectZone = React.forwardRef(({disabled, onFileChange, className, file, onError, maxImageSize}: {
    disabled?: boolean,
    onFileChange: (file: File) => void,
    className?: string,
    file: File | null,
    onError?: (error: string) => void,
    maxImageSize?: number
}, ref: ForwardedRef<FileSelectZoneRef>) => {
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');

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
        if (maxImageSize && file.size > (maxImageSize * 1024 * 1024)) {
            const maxStr = formatFileSize(maxImageSize)
            onError?.(`File size exceeds ${maxStr}.`)
            return;
        }
        onFileChange?.(file)
    }, [disabled, maxImageSize, onFileChange, onError]);

    useEffect(() => {
        console.log('addEventListener');
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
                onError?.('Only JPG, PNG, and GIF images are supported.')
                return;
            }
            fileChange(file);
        }

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [fileChange, onError]);

    // useEffect(() => {
    //     console.log('FileSelectZone fileChange change')
    // }, [fileChange]);
    //
    // useEffect(() => {
    //     console.log('FileSelectZone onError change')
    // }, [onError]);

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
                <div className="w-full h-full p-2 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} className={'object-scale-down max-h-full rounded-md m-auto'} alt="Preview"/>
                </div>
            ) : (
                <>
                    <UploadIcon className="w-8 h-8 text-muted-foreground"/>
                    <p className="mt-2 text-sm text-muted-foreground">Drag and drop file here</p>
                </>
            )}

        </FileDropZone>
    )
})

FileSelectZone.displayName = 'FileSelectZone'

export { FileSelectZone };