// pages/content/projects/page.tsx

"use client";
import React, { useState, useEffect } from 'react';

export default function Index() {
  const [metadata, setMetadata] = useState(null);

  async function fetchMetadata(url) {
    try {
      const response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      setMetadata(data);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  }

  useEffect(() => {
    fetchMetadata('https://github.com/yiwen001/Match-4-Game');
  }, []);

  return (
    <>
      <h1></h1>
      {metadata && (
        <div>
          <h2>{metadata.title}</h2>
          <p>{metadata.description}</p>
          {metadata.image && <img src={metadata.image} alt="Preview" />}
        </div>
      )}
    </>
  );
}