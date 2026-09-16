'use client';

export default function FontLoader() {
  return (
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
      media="print"
      onLoad={(e) => {
        (e.currentTarget as HTMLLinkElement).media = 'all';
      }}
    />
  );
}
