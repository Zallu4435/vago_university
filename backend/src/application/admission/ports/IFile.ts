// src/application/admission/ports/IFile.ts

// Basic interface for a single file upload
export interface IFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer; // Key difference: Multer's in-memory storage uses buffer
    // Add any other properties you rely on from Multer's file object
}

// Interface for multiple files
export interface IMultipleFiles extends Array<IFile> { }