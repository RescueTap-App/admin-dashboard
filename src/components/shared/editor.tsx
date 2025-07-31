import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const RichTextEditor = ({ value, onChange }: Props) => {
  return (
    <Suspense>
      <ReactQuill
        value={value}
        onChange={onChange}
        theme="snow"
        placeholder="Write your content here..."
        style={{ height: '300px', marginBottom: '40px' }}
      />
    </Suspense>
  );
};

export default RichTextEditor;
