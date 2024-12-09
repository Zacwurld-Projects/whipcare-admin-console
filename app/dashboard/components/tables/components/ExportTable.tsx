'use client';
import ChevronDownIcon from '../../../assets/chevronDown.svg';
import DownloadIcon from '../../../assets/downloadIcon.svg';
import PDFIcon from '../../../assets/pdfFileIcon.svg';
import PNGIcon from '../../../assets/pngFileIcon.svg';
import XLSIcon from '../../../assets/xlsFileIcon.svg';
import useMenu from '@/app/hooks/useMenu';
import { useRef } from 'react';

const ExportTable = () => {
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const { isMenuOpen: isExportMenuOpen, setIsMenuOpen: setIsExportMenuOpen } = useMenu(
    exportButtonRef,
    exportMenuRef,
  );

  return (
    <div className='relative'>
      <button
        ref={exportButtonRef}
        className='text-small flex items-center gap-[10px] rounded-lg border border-gray-300 px-3 py-2 font-semibold text-gray-700'
        onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
      >
        <div className='flex items-center gap-2'>
          <DownloadIcon />
          <p>Export table</p>
        </div>
        <ChevronDownIcon />
      </button>
      {isExportMenuOpen && (
        <div
          className='flex-column [&_button]:text-small absolute right-0 top-[calc(100%+16px)] w-[176px] rounded bg-white py-[10px] shadow-[0px_2px_20px_0px_rgba(0,0,0,0.13)] [&_button]:flex [&_button]:items-center [&_button]:gap-3 [&_button]:px-4 [&_button]:py-2 [&_button]:pb-1 [&_button]:text-gray-500'
          ref={exportMenuRef}
        >
          <button className='hover:bg-primary-50 hover:text-[#983504] [&_path]:hover:fill-[#983504]'>
            <PNGIcon />
            <p>As PNG</p>
          </button>
          <button className='hover:bg-primary-50 hover:text-[#983504] [&_path]:hover:fill-[#983504]'>
            <PDFIcon />
            <p>As PDF</p>
          </button>
          <button className='hover:bg-primary-50 hover:text-[#983504] [&_path]:hover:fill-[#983504]'>
            <XLSIcon />
            <p>As XLS</p>
          </button>
        </div>
      )}
    </div>
  );
};
export default ExportTable;
