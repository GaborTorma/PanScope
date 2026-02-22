import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Legend from '../components/Legend';

describe('Legend (összehasonlítás nélkül)', () => {
    test('Ding felirat megjelenik', () => {
        render(<Legend hasCompare={false} />);
        expect(screen.getByText(/Ding/i)).toBeInTheDocument();
    });

    test('Hangsor felirat megjelenik', () => {
        render(<Legend hasCompare={false} />);
        expect(screen.getByText(/Hangsor/i)).toBeInTheDocument();
    });

    test('Összehasonlítás-specifikus feliratok NEM jelennek meg', () => {
        render(<Legend hasCompare={false} />);
        expect(screen.queryByText(/Csak 1\. Skála/i)).toBeNull();
        expect(screen.queryByText(/Csak 2\. Skála/i)).toBeNull();
    });
});

describe('Legend (összehasonlítással)', () => {
    test('"Csak 1. Skála" felirat megjelenik', () => {
        render(<Legend hasCompare={true} />);
        expect(screen.getByText(/Csak 1\. Skála/i)).toBeInTheDocument();
    });

    test('"Csak 2. Skála" felirat megjelenik', () => {
        render(<Legend hasCompare={true} />);
        expect(screen.getByText(/Csak 2\. Skála/i)).toBeInTheDocument();
    });

    test('"Közös hang" felirat megjelenik', () => {
        render(<Legend hasCompare={true} />);
        expect(screen.getByText(/Közös hang/i)).toBeInTheDocument();
    });
});
