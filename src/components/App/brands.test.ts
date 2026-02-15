import brands from './brands';

interface Brand {
  alt: string;
  href: string;
  src: string;
}

describe('brands', () => {
  it('exports expected logo metadata', () => {
    expect(brands).toHaveLength(3);

    const typedBrands = brands as Brand[];
    expect(typedBrands.map(({ alt }) => alt)).toEqual([
      'Vite logo',
      'React logo',
      'Tailwind logo',
    ]);
    expect(typedBrands.map(({ href }) => href)).toEqual([
      'https://vite.dev',
      'https://react.dev',
      'https://tailwindcss.com',
    ]);

    typedBrands.forEach(({ src }) => {
      expect(src.length).toBeGreaterThan(0);
    });
  });
});
