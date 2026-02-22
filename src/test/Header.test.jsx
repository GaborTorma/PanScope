import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

describe('Header', () => {
    test('megjeleníti a "PanScope" főcímet', () => {
        render(<Header />);
        expect(screen.getByText('PanScope')).toBeInTheDocument();
    });

    test('h1 elembe kerül a cím', () => {
        const { container } = render(<Header />);
        const h1 = container.querySelector('h1');
        expect(h1).not.toBeNull();
        expect(h1.textContent).toBe('PanScope');
    });

    test('megjelenik az alcím', () => {
        render(<Header />);
        expect(screen.getByText(/Handpan Skála Vizualizáló/i)).toBeInTheDocument();
    });
});
