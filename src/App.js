import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import pako from 'pako';
import { FiDownload } from 'react-icons/fi';

function App() {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState(null);

  const handleFile = (e) => setFile(e.target.files[0]);

  const compressPDF = async () => {
    if (!file) return alert('Please select a PDF file first.');
    try {
      const bytes = await file.arrayBuffer();
      const isCompressed = bytes[0] === 0x1f && bytes[1] === 0x8b;
      const pdfBytes = isCompressed ? pako.inflate(new Uint8Array(bytes)) : bytes;
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      setLink(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Error compressing PDF:', error);
      alert('An error occurred while compressing the PDF.');
    }
  };

  return (
    <div className='container mx-auto'>
      <div className="grid h-screen place-items-center">
        <div className='flex flex-col items-center mt-32 min-w-max'>
          <h1 className='text-4xl mb-1'>PDF Compression</h1>
          <h1 className='text-sm text-thin text-zinc-700 mb-12'>Free, fast, and simple</h1>
          <input type="file" accept=".pdf" onChange={handleFile} className='w-full border bg-zinc-50 border-gray-200 shadow-xs rounded-md text-sm focus:z-10 focus:border-zinc-500 focus:ring-zinc-500 file:bg-zinc-300 file:text-white file:border-0 file:bg-gray-100 file:mr-4 file:py-3 file:px-4 file:bg-zinc-100 file:text-zinc-900 cursor-pointer mb-2' />
          {link && (
            <div className='flex items-center justify-between w-full p-2 border border-zinc-200 rounded-xl'>
              <p className='text-zinc-500 ml-1 text-sm font-light'>Successfully</p>
              <a href={link} download="compressed.pdf" className='border border-zinc-200 rounded-xl p-2 hover:bg-zinc-200'>
                <FiDownload size='18px' />
              </a>
            </div>
          )}
          <button onClick={compressPDF} className='bg-zinc-900 rounded-xl px-6 py-2 text-white my-4'>Compress PDF</button>
        </div>
        <a href="/" className="flex flex-col items-center justify-center my-16 space-y-2">
          <img className="h-16 aspect-square w-16 rounded-full" src="https://colors.dinivannendra.xyz/una.jpeg" />
          <p className="text-zinc-400 text-xs font-light text-center ">Crafted by <br /> Dinivan Nendra</p>
        </a>
      </div>
    </div>
  );
}

export default App;
